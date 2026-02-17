import pandas as pd

def read_metrics(file_path):
    print(f"\n--- Reading {file_path} ---")
    try:
        df = pd.read_excel(file_path)
        print(df.head())
        print(df.describe())
        print("Columns:", df.columns.tolist())
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

files = [
    'output/resultados_quantile_6m.xlsx', 
    'output/recomendacao_estoque_6m.xlsx'
]

for f in files:
    read_metrics(f)
