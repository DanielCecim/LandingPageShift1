import pandas as pd

def read_metrics(file_path):
    print(f"\n--- Reading {file_path} ---")
    try:
        df = pd.read_excel(file_path)
        print(df.head().to_markdown())
        print(df.describe().to_markdown())
        # Check if there are specific columns like 'MAPE', 'RMSE', 'Profit', etc.
        print("Columns:", df.columns.tolist())
    except Exception as e:
        print(f"Error: {e}")

files = [
    'output/resultados_quantile_6m_new.xlsx',
    'output/recomendacao_estoque_6m_new.xlsx'
]

for f in files:
    read_metrics(f)
