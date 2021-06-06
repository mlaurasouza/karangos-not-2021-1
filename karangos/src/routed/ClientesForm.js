import InputMask from 'react-input-mask'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import { makeStyles } from '@material-ui/core/styles'
import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      marginBottom: '24px',
    }
  },
  toolbar: {
    marginTop: '36px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  checkbox: {
    alignItems: 'center'
  }
}))

//Representando as classes de carecteres da máscara como um obj
const formatChars = {
  'A': '[A-Za-z]',
  '0': '[0-9]',
  '#': '[0-9A-Ja-j]'
}

//Máscara de entrada dos campos cpf, rg e telefone
const cpfMask = '000.000.000-00'
const rgMask = '00.000.000-0'
const telefoneMask = '(00) 0000-0000'

export default function ClientesForm() {
  const classes = useStyles()

  const [clientes, setClientes] = useState({
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })

  const [snackState, setSnackState] = useState({
    open: false,
    severity: 'success',
    message: 'Cliente salvo com sucesso'
  })

  const [btnSendState, setBtnSendState] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [error, setError] = useState({
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })

  const [isModified, setIsModified] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [title, setTitle] = useState('Cadastrar Novo Cliente')

  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    // Verifica se tem o parâmetro id na rota. Se tiver, temos que buscar
    // os dados do registro no back-end para edição
    if (params.id) {
      setTitle('Editando Cliente')
      getData(params.id)
    }
  }, [])

  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
      setClientes(response.data)
    }
    catch (error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  }

  function handleInputChange(event, property) {

    const clientesTemp = { ...clientes }

    if (event.target.id) property = event.target.id

    if (property === 'cpf') {
      clientesTemp[property] = event.target.value
    }
    else if (property === 'rg') {
      clientesTemp[property] = event.target.value
    }
    else if (property === 'telefone') {
      clientesTemp[property] = event.target.value
    }
    else {
      clientesTemp[property] = event.target.value
    }

    setClientes(clientesTemp)
    setIsModified(true)   // O formulário foi modificado
    validate(clientesTemp)     // Dispara a validação
  }

  function validate(data) {

    const errorTemp = {
      nome: '',
      cpf: '',
      rg: '',
      logradouro: '',
      num_imovel: '',
      bairro: '',
      municipio: '',
      uf: '',
      telefone: '',
      email: ''
    }
    let isValid = true

    // Validação do campo nome
    if (data.nome.trim() === '') {
      errorTemp.nome = 'O nome deve ser preenchido'
      isValid = false
    }

    // Validação do campo CPF
    if (data.cpf.trim() === '' || data.cpf.includes('_')) {
      errorTemp.cpf = 'O CPF deve ser corretamente preenchido'
      isValid = false
    }

    // Validação do campo RG
    if (data.rg.trim() === '' || data.rg.includes('_')) {
      errorTemp.rg = 'O RG deve ser corretamente preenchido'
      isValid = false
    }

    // Validação do campo logradouro
    if (data.logradouro.trim() === '') {
      errorTemp.logradouro = 'O logradouro deve ser preenchido'
      isValid = false
    }

    // Validação do campo número
    if (data.num_imovel.trim() === '') {
      errorTemp.num_imovel = 'O número deve ser preenchido'
      isValid = false
    }

    // Validação do campo bairro
    if (data.bairro.trim() === '') {
      errorTemp.bairro = 'O bairro deve ser preenchido'
      isValid = false
    }

    // Validação do campo município
    if (data.municipio.trim() === '') {
      errorTemp.municipio = 'O município deve ser preenchido'
      isValid = false
    }

    // Validação do campo estado
    if (data.uf.trim() === '') {
      errorTemp.uf = 'O estado deve ser preenchido'
      isValid = false
    }

    // Validação do campo telefone
    if (data.telefone.trim() === '' || data.telefone.includes('_')) {
      errorTemp.telefone = 'O telefone deve ser corretamente preenchido'
      isValid = false
    }

    // Validação do campo email
    if (data.email.trim() === '') {
      errorTemp.email = 'O e-mail deve ser preenchido'
      isValid = false
    }

    setError(errorTemp)
    return isValid
  }

  async function saveData() {
    try {
      // Desabilitar o botão Enviar
      setBtnSendState({ disabled: true, label: 'Enviando...' })

      // Se o registro já existe (edição, verbo HTTP PUT)
      if (params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, clientes)

      else await axios.post('https://api.faustocintra.com.br/clientes', clientes)
 
      setSnackState({
        open: true,
        severity: 'success',
        message: 'Cliente salvo com sucesso!'
      })

    }
    catch (error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'ERRO:' + error.message
      })
    }

    // Reabilitar o botão Enviar
    setBtnSendState({ disabled: false, label: 'Enviar' })
  }

  function handleSubmit(event) {

    event.preventDefault() // Evita o recarregamento da página

    // Só salva os dados se eles forem válidos
    if (validate(clientes)) saveData()

  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function handleSnackClose(event, reason) {
    // Evita que a snackbar seja fechada clicando-se fora dela
    if (reason === 'clickaway') return
    setSnackState({ ...snackState, open: false }) // Fecha a snackbar

    // Retorna à página de listagem
    history.push('/listc')   // Retorna à página de listagem
  }

  function handleDialogClose(result) {
    setDialogOpen(false)

    // Se o usuário concordou em voltar
    if (result) history.push('/listc')
  }

  function handleGoBack() {
    // Se o formulário estiver modificado, mostramos o diálogo de confirmação
    if (isModified) setDialogOpen(true)
    // Senão, voltamos diretamente à página de listagem
    else history.push('/listc')
  }

  return (
    <>
      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackState.severity}>
          {snackState.message}
        </Alert>
      </Snackbar>

      <h1>Cadastrar Novo Cliente</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="nome"
          label="Nome"
          variant="filled"
          value={clientes.nome}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.nome !== ''}
          helperText={error.nome}
        />

        <InputMask
          formatChars={formatChars}
          mask={cpfMask}
          id="cpf"
          onChange={event => handleInputChange(event, 'cpf')}
          value={clientes.cpf}
        >
          {() => <TextField
            label="CPF"
            variant="filled"
            fullWidth
            required
            error={error.cpf !== ''}
            helperText={error.cpf}
          />}
        </InputMask>

        <InputMask
          formatChars={formatChars}
          mask={rgMask}
          fullWidth
          id="rg"
          onChange={event => handleInputChange(event, 'rg')}
          value={clientes.rg}
        >
          {() => <TextField
            label="RG"
            variant="filled"
            fullWidth
            required
            error={error.rg !== ''}
            helperText={error.rg}
          />}
        </InputMask>

        <TextField
          id="logradouro"
          label="Logradouro"
          variant="filled"
          value={clientes.logradouro}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.logradouro !== ''}
          helperText={error.logradouro}
        />

        <TextField
          id="num_imovel"
          label="Número"
          variant="filled"
          value={clientes.num_imovel}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.num_imovel !== ''}
          helperText={error.num_imovel}
        />

        <TextField
          id="complemento"
          label="Complemento"
          variant="filled"
          value={clientes.complemento}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          id="bairro"
          label="Bairro"
          variant="filled"
          value={clientes.bairro}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.bairro !== ''}
          helperText={error.bairro}
        />

        <TextField
          id="municipio"
          label="Município"
          variant="filled"
          value={clientes.municipio}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.municipio !== ''}
          helperText={error.municipio}
        />

        <TextField
          id="uf"
          label="Estado"
          variant="filled"
          value={clientes.uf}
          onChange={event => handleInputChange(event, 'uf')}
          select
          fullWidth
          required
          error={error.uf !== ''}
          helperText={error.uf}>
          <MenuItem value="AC">Acre</MenuItem>
          <MenuItem value="AL">Alagoas</MenuItem>
          <MenuItem value="AP">Amapá</MenuItem>
          <MenuItem value="AM">Amazonas</MenuItem>
          <MenuItem value="BA">Bahia</MenuItem>
          <MenuItem value="CE">Ceará</MenuItem>
          <MenuItem value="DF">Distrito Federal</MenuItem>
          <MenuItem value="ES">Espírito Santo</MenuItem>
          <MenuItem value="GO">Goiás</MenuItem>
          <MenuItem value="MA">Maranhão</MenuItem>
          <MenuItem value="MT">Mato Grosso</MenuItem>
          <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
          <MenuItem value="MG">Minas Gerais</MenuItem>
          <MenuItem value="PA">Pará</MenuItem>
          <MenuItem value="PB">Paraíba</MenuItem>
          <MenuItem value="PR">Paraná</MenuItem>
          <MenuItem value="PE">Pernambuco</MenuItem>
          <MenuItem value="PI">Piauí</MenuItem>
          <MenuItem value="RJ">Rio de Janeiro</MenuItem>
          <MenuItem value="RN">Rio Grande do Norte</MenuItem>
          <MenuItem value="RS">Rio Grande do Sul</MenuItem>
          <MenuItem value="RO">Rondônia</MenuItem>
          <MenuItem value="RR">Roraima</MenuItem>
          <MenuItem value="SC">Santa Catarina</MenuItem>
          <MenuItem value="SP">São Paulo</MenuItem>
          <MenuItem value="SE">Sergipe</MenuItem>
          <MenuItem value="TO">Tocantins</MenuItem>
        </TextField>

        <InputMask
          formatChars={formatChars}
          mask={telefoneMask}
          fullWidth
          id="telefone"
          onChange={event => handleInputChange(event, 'telefone')}
          value={clientes.telefone}
        >
          {() => <TextField
            label="Telefone"
            variant="filled"
            fullWidth
            required
            error={error.telefone !== ''}
            helperText={error.telefone}
          />}
        </InputMask>

        <TextField
          id="email"
          type= "email"
          label="E-mail"
          variant="filled"
          value={clientes.email}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.email !== ''}
          helperText={error.email}
        />

        <Toolbar className={classes.toolbar}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={btnSendState.disabled}
          >
            {btnSendState.label}
          </Button>
          <Button variant="contained" onClick={handleGoBack}>
            Voltar
          </Button>
        </Toolbar>

      </form>
    </>
  )
}