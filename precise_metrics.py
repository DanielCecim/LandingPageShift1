import pandas as pd

f_rec = 'output/recomendacao_estoque_6m_new.xlsx'
df_rec = pd.read_excel(f_rec)

print("\n--- RECOMENDACAO COLUMNS ---")
for c in df_rec.columns:
    print(c)

print("\n--- RECOMENDACAO DATA SUMMARY ---")
# Try to find total current stock vs recommended
# Looking for columns like 'Saldo', 'Valor', 'Custo'
possible_cols = [c for c in df_rec.columns if 'VALOR' in c.upper() or 'SALDO' in c.upper() or 'CUSTO' in c.upper()]
if possible_cols:
    print(df_rec[possible_cols].sum())

f_res = 'output/resultados_quantile_6m_new.xlsx'
df_res = pd.read_excel(f_res)
print("\n--- RESULTADOS COLUMNS ---")
for c in df_res.columns:
    print(c)

print("\n--- RESULTADOS DATA SUMMARY ---")
print(df_res.mean(numeric_only=True))
