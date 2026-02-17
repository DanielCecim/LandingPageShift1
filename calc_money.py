import pandas as pd

rec = pd.read_excel('output/recomendacao_estoque_6m_new.xlsx')
# Find columns with 'VALOR' or 'SALDO' if I can't guess them
# Based on common naming: 'Saldo_Atual', 'Saldo_Recomendado'
# I'll print sums of numeric columns that might be relevant
for c in rec.columns:
    if 'VALOR' in c.upper() or 'SALDO' in c.upper() or 'CUSTO' in c.upper() or 'ESTOQUE' in c.upper():
        try:
            val = rec[c].sum()
            print(f"{c}: {val:,.2f}")
        except:
            pass
