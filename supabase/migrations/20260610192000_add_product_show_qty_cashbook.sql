-- Add show_qty_in_cashbook to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_qty_in_cashbook BOOLEAN NOT NULL DEFAULT false;

-- Update existing 14kg home delivery products to default to true
UPDATE public.products SET show_qty_in_cashbook = true WHERE name ILIKE '%14%home%' OR name ILIKE '%14%delivery%';
