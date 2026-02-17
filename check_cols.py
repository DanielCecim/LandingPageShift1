import pandas as pd

f1 = 'output/recomendacao_estoque_6m_new.xlsx'
f2 = 'output/resultados_quantile_6m_new.xlsx'

try:
    c1 = pd.read_excel(f1, nrows=0).columns.tolist()
    print(f"Columns in {f1}: {c1}")
except:
    print(f"Error reading {f1}")

try:
    c2 = pd.read_excel(f2, nrows=0).columns.tolist()
    print(f"Columns in {f2}: {c2}")
except:
    print(f"Error reading {f2}")
