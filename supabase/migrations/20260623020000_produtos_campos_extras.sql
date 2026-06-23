-- Campos extras de produto vindos da planilha Shinova, preservados no admin.
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS marca TEXT,
  ADD COLUMN IF NOT EXISTS subcategoria TEXT,
  ADD COLUMN IF NOT EXISTS configuracoes TEXT,
  ADD COLUMN IF NOT EXISTS url_fabricante TEXT;
