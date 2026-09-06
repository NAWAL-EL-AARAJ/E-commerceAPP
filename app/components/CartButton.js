'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartButton() {
  const { nombreArticles } = useCart()

  return (
    <Link
      href="/panier"
      className="fixed top-6 right-6 bg-ink text-ivory px-4 py-2 text-sm hover:bg-majorelle transition-colors z-50"
    >
      Panier ({nombreArticles})
    </Link>
  )
}