import { supabase } from './lib/supabase'
import ProductGrid from './components/ProductGrid'
import CartButton from './components/CartButton'

export default async function Home() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <CartButton />

      <header className="mb-12">
        <h1 className="font-display text-4xl text-ink">MERHAS</h1>
        <p className="text-ink/60 mt-1">Foulards choisis avec soin</p>
      </header>

      <ProductGrid produits={produits} />
    </main>
  )
}