#!/usr/bin/env python3
"""Vuelca el Excel REAL de inventario a src/data/properties.real.json.
Uso: python3 -I scripts/build_properties.py <ruta.xls>
Nada se inventa: lo que no esta en el Excel va vacio/0/false.
"""
import json
import re
import sys
import unicodedata

import xlrd

OP = {"Venta": "venta", "Alquiler": "alquiler", "Traspaso": "venta"}


def slug(text):
    # Misma regla que propertySlug en properties.ts: NFD, sin acentos, no-alfanum -> '-'
    norm = unicodedata.normalize("NFD", text)
    norm = "".join(c for c in norm if unicodedata.category(c) != "Mn")
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", norm.lower()))


def to_int(val):
    s = str(val).strip()
    if s in ("", "--"):
        return 0
    try:
        return int(float(s))
    except ValueError:
        return 0


def floor_of(val):
    s = str(val).strip()
    if s == "Bajo":
        return 0
    m = re.match(r"^(\d+)", s)
    return int(m.group(1)) if m else 0


def main(xls_path, out_path):
    sh = xlrd.open_workbook(xls_path).sheet_by_name("Hoja1")
    props = []
    town_names = {}  # slug -> nombre real
    for r in range(1, sh.nrows):
        (expediente, op, tipo, poblacion, sit1, sup_total, _solar, altura,
         estado, hab, banos, precio, _llaves, _portales) = sh.row_values(r)
        town_slug = slug(str(poblacion).strip())
        town_names[town_slug] = str(poblacion).strip()
        sit1 = str(sit1).strip()
        if "-" in sit1:
            zone = sit1.split("-", 1)[1].strip()
        else:
            zone = sit1 or str(poblacion).strip()
        props.append({
            "ref": str(expediente).strip(),
            "operation": OP[str(op).strip()],
            "type": str(tipo).strip(),
            "town": town_slug,
            "zone": zone,
            "price": int(float(precio)) if str(precio).strip() != "" else 0,
            "previousPrice": None,
            "rooms": to_int(hab),
            "baths": to_int(banos),
            "area": round(float(sup_total)) if str(sup_total).strip() != "" else 0,
            "floor": floor_of(altura),
            "elevator": False,
            "parking": False,
            "terrace": False,
            "state": str(estado).strip(),
            "tag": "",
            "likes": "",
            "watchOut": "",
            "description": "",
            "photos": 0,
            "tone": 1,
            "images": [],
        })

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False, indent=2)
        f.write("\n")

    # Informe
    from collections import Counter
    ops = Counter(p["operation"] for p in props)
    ventas = {p["town"] for p in props if p["operation"] == "venta"}
    print(f"Total inmuebles: {len(props)}")
    print(f"Por operacion: {dict(ops)}")
    print(f"Municipios distintos: {len(town_names)}")
    for s in sorted(town_names):
        print(f"  {s} | {town_names[s]} | venta>=1: {s in ventas}")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "/Users/sebastian/Downloads/listado_20261028104850.xls"
    out = sys.argv[2] if len(sys.argv) > 2 else "/Users/sebastian/conroma-web/src/data/properties.real.json"
    main(src, out)
