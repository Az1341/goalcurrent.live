#!/usr/bin/env python3
import json, sys
from pathlib import Path
SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
from gen_deep_i18n_patches_fr import FR
from gen_deep_i18n_patches_locales import LOCALES
DIR = SCRIPTS / "deep-i18n"
for locale, patch in {"fr": FR, **LOCALES}.items():
    p = DIR / f"{locale}.json"
    p.write_text(json.dumps(patch, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", p.name)