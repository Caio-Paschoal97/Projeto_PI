import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function EditarSemente() {
  const router = useRouter()
  const { id } = router.query

  const [nomePopular, setNomePopular] = useState('')
  const [nomeCientifico, setNomeCientifico] = useState('')
  const [fabricante, setFabricante] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number | ''>('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!id || Array.isArray(id)) return

    async function carregar() {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/sementes/${id}`)

        setNomePopular(data.nomePopular)
        setNomeCientifico(data.nomeCientifico)
        setFabricante(data.fabricante)
        setDataValidade(data.dataValidade) // já vem como yyyy-MM-dd
        setQuantidadeEstoque(data.quantidadeEstoque)
      } catch (e) {
        alert('Erro ao carregar semente')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!id || Array.isArray(id)) return

    try {
      await axios.put(`http://localhost:8080/api/sementes/${id}`, {
        nomePopular,
        nomeCientifico,
        fabricante,
        dataValidade,
        quantidadeEstoque: quantidadeEstoque === '' ? 0 : quantidadeEstoque
      })

      alert('Semente atualizada com sucesso')
      router.push('/sementes')
    } catch (e) {
      alert('Erro ao atualizar semente')
    }
  }

  if (carregando) {
    return <p>Carregando dados da semente...</p>
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Editar semente</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>Nome popular</label>
          <input
            type="text"
            value={nomePopular}
            onChange={e => setNomePopular(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Nome científico</label>
          <input
            type="text"
            value={nomeCientifico}
            onChange={e => setNomeCientifico(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Fabricante</label>
          <input
            type="text"
            value={fabricante}
            onChange={e => setFabricante(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Data de validade</label>
          <input
            type="date"
            value={dataValidade}
            onChange={e => setDataValidade(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Quantidade em estoque</label>
          <input
            type="number"
            value={quantidadeEstoque}
            onChange={e =>
              setQuantidadeEstoque(e.target.value === '' ? '' : Number(e.target.value))
            }
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
