#!/usr/bin/env python3
"""
Sube la demo privada a Hostinger por FTP.

Uso:
    python3 scripts/subir-preview.py                 # sube la carpeta entera
    python3 scripts/subir-preview.py --solo-zip      # sube solo el .zip (mas rapido)

Lee las credenciales de un archivo `.hostinger` en la raiz del repo, que NO se commitea.
Nunca las imprime ni las guarda en ningun otro sitio.

Formato de `.hostinger`:

    FTP_HOST=ftp.conromaasesores.com
    FTP_USER=u123456789.demo
    FTP_PASS=la-contrasena-ftp
    FTP_DIR=/public_html/demo

Los cuatro datos salen de hPanel > Archivos > Cuentas FTP.
"""
from __future__ import annotations

import os
import sys
from ftplib import FTP, FTP_TLS, error_perm
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LOCAL = Path(os.environ.get('PREVIEW_DIR', Path.home() / 'Desktop' / 'conroma-preview-hostinger'))


def cargar_credenciales() -> dict[str, str]:
    archivo = RAIZ / '.hostinger'
    if not archivo.exists():
        sys.exit(
            f"No encuentro {archivo}.\n\n"
            "Crealo con estas cuatro lineas (los datos estan en hPanel > Archivos >\n"
            "Cuentas FTP; si no hay ninguna, crea una para la carpeta del subdominio):\n\n"
            "  FTP_HOST=ftp.conromaasesores.com\n"
            "  FTP_USER=u000000000.demo\n"
            "  FTP_PASS=...\n"
            "  FTP_DIR=/public_html/demo\n\n"
            "Ese archivo esta en .gitignore: no se sube a GitHub."
        )
    datos: dict[str, str] = {}
    for linea in archivo.read_text(encoding='utf-8').splitlines():
        linea = linea.strip()
        if not linea or linea.startswith('#') or '=' not in linea:
            continue
        clave, valor = linea.split('=', 1)
        datos[clave.strip()] = valor.strip().strip('"\'')
    faltan = [c for c in ('FTP_HOST', 'FTP_USER', 'FTP_PASS') if not datos.get(c)]
    if faltan:
        sys.exit(f"A .hostinger le faltan: {', '.join(faltan)}")
    datos.setdefault('FTP_DIR', '/public_html/demo')
    return datos


def conectar(cred: dict[str, str]) -> FTP:
    """FTPS explicito si el servidor lo admite; si no, FTP plano."""
    try:
        ftp = FTP_TLS(cred['FTP_HOST'], timeout=60)
        ftp.login(cred['FTP_USER'], cred['FTP_PASS'])
        ftp.prot_p()
        print('Conectado por FTPS (cifrado).')
    except Exception:
        ftp = FTP(cred['FTP_HOST'], timeout=60)
        ftp.login(cred['FTP_USER'], cred['FTP_PASS'])
        print('Conectado por FTP sin cifrar: el servidor no admite FTPS.')
    ftp.set_pasv(True)
    return ftp


def asegurar_directorio(ftp: FTP, remoto: str) -> None:
    actual = ''
    for parte in remoto.strip('/').split('/'):
        actual += '/' + parte
        try:
            ftp.mkd(actual)
        except error_perm:
            pass  # ya existia


def subir(ftp: FTP, local: Path, remoto: str) -> None:
    with local.open('rb') as f:
        ftp.storbinary(f'STOR {remoto}', f, blocksize=1024 * 256)


def borrar_fichas_retiradas(ftp: FTP, base: str) -> None:
    """Subir no borra nada: sin esto, la ficha de un piso retirado seguiría en el servidor.
    Solo toca carpetas de <idioma>/inmueble/ que ya no existen en el build local."""
    borradas = 0
    for lang in ('es', 'en', 'ca'):
        local = LOCAL / lang / 'inmueble'
        if not local.is_dir():
            continue  # build raro: mejor no borrar nada de ese idioma
        remoto = f"{base}/{lang}/inmueble"
        try:
            nombres = [n.rsplit('/', 1)[-1] for n in ftp.nlst(remoto)]
        except error_perm:
            continue
        for nombre in nombres:
            if nombre in ('.', '..') or (local / nombre).exists():
                continue
            carpeta = f"{remoto}/{nombre}"
            for archivo in ftp.nlst(carpeta):
                archivo = archivo.rsplit('/', 1)[-1]
                if archivo not in ('.', '..'):
                    ftp.delete(f"{carpeta}/{archivo}")
            ftp.rmd(carpeta)
            borradas += 1
            print(f"  ficha retirada borrada: {lang}/inmueble/{nombre}")
    print(f"Fichas retiradas borradas del servidor: {borradas}.")


def main() -> None:
    cred = cargar_credenciales()
    solo_zip = '--solo-zip' in sys.argv

    if solo_zip:
        zip_local = LOCAL.with_suffix('.zip')
        if not zip_local.exists():
            sys.exit(f"No encuentro {zip_local}. Generalo con: bash scripts/preparar-preview.sh")
        archivos = [(zip_local, zip_local.name)]
        total_bytes = zip_local.stat().st_size
    else:
        if not LOCAL.is_dir():
            sys.exit(f"No encuentro {LOCAL}. Generala con: bash scripts/preparar-preview.sh")
        archivos = []
        total_bytes = 0
        for ruta in sorted(LOCAL.rglob('*')):
            if ruta.is_file() and ruta.name != '.DS_Store':
                archivos.append((ruta, str(ruta.relative_to(LOCAL))))
                total_bytes += ruta.stat().st_size

    print(f"{len(archivos)} archivos · {total_bytes / 1024 / 1024:.0f} MB → {cred['FTP_DIR']}")

    ftp = conectar(cred)
    asegurar_directorio(ftp, cred['FTP_DIR'])

    # Las fotos de fotos/ no cambian nunca (un nombre por foto y tamaño): solo se suben las que no están.
    try:
        en_servidor = {n.rsplit('/', 1)[-1] for n in ftp.nlst(f"{cred['FTP_DIR'].rstrip('/')}/fotos")}
    except Exception:
        en_servidor = set()
    ya = [a for a in archivos if a[1].startswith('fotos/') and a[1].rsplit('/', 1)[-1] in en_servidor]
    if ya:
        archivos = [a for a in archivos if not (a[1].startswith('fotos/') and a[1].rsplit('/', 1)[-1] in en_servidor)]
        total_bytes -= sum(ruta.stat().st_size for ruta, _ in ya)
        print(f"{len(ya)} fotos ya estaban en el servidor · quedan {len(archivos)} archivos · {total_bytes / 1024 / 1024:.0f} MB")

    creados: set[str] = set()
    subidos = enviados = fallos = 0
    for local_path, rel in archivos:
        destino = f"{cred['FTP_DIR'].rstrip('/')}/{rel}"
        carpeta = destino.rsplit('/', 1)[0]
        if carpeta not in creados:
            asegurar_directorio(ftp, carpeta)
            creados.add(carpeta)
        try:
            subir(ftp, local_path, destino)
            subidos += 1
            enviados += local_path.stat().st_size
        except Exception as error:  # un archivo suelto no debe tumbar la subida entera
            fallos += 1
            print(f"  FALLO {rel}: {error}")
        if subidos % 25 == 0 or subidos == len(archivos):
            pct = enviados / total_bytes * 100 if total_bytes else 100
            print(f"  {subidos}/{len(archivos)} ({pct:.0f}%)")

    if os.environ.get('BORRAR_FICHAS_RETIRADAS') == '1' and not fallos:
        borrar_fichas_retiradas(ftp, cred['FTP_DIR'].rstrip('/'))
    ftp.quit()
    print(f"\nSubidos {subidos} archivos. Fallos: {fallos}.")
    if fallos:
        print("Vuelve a lanzarlo: sobrescribe lo que ya esta y reintenta lo que fallo.")
    else:
        print(f"Comprueba: https://demo.conromaasesores.com/")


if __name__ == '__main__':
    main()
