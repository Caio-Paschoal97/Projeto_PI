import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Semente {
  id: number
  nomePopular: string
  nomeCientifico: string
  fabricante: string
  dataValidade: string // vem como yyyy-MM-dd
  quantidadeEstoque: number
}

export default function ListaSementes() {
  const [sementes, setSementes] = useState<Semente[]>([])
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  async function carregarSementes() {
    try {
      setCarregando(true)
      const { data } = await axios.get<Semente[]>('http://localhost:8080/api/sementes')
      setSementes(data)
    } catch (e) {
      alert('Erro ao carregar sementes')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarSementes()
  }, [])

  async function handleExcluir(id: number) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta semente?')
    if (!confirmar) return

    try {
      await axios.delete(`http://localhost:8080/api/sementes/${id}`)
      alert('Semente excluída com sucesso')
      await carregarSementes()
    } catch (e) {
      alert('Erro ao excluir semente')
    }
  }

  function handleEditar(id: number) {
    router.push(`/sementes/${id}`)
  }

  function handleNova() {
    router.push('/sementes/nova')
  }

  if (carregando) {
    return <p>Carregando sementes...</p>
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Lista de sementes</h1>

      <button onClick={handleNova} style={{ margin: '16px 0' }}>
        Cadastrar nova semente
      </button>

      {sementes.length === 0 ? (
        <p>Nenhuma semente cadastrada.</p>
      ) : (
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%'
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nome popular</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nome científico</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Fabricante</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Validade</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Estoque</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sementes.map(semente => (
              <tr key={semente.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.nomePopular}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.nomeCientifico}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.fabricante}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.dataValidade}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{semente.quantidadeEstoque}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button onClick={() => handleEditar(semente.id)} style={{ marginRight: '8px' }}>
                    Editar
                  </button>
                  <button onClick={() => handleExcluir(semente.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
