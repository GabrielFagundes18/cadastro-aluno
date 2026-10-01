// ============================================================
// CadastroAluno - formulário de cadastro de aluno (Expo / React Native)
// ============================================================

// useState: hook do React que guarda o valor de cada campo (campo "controlado").
import React, { useState } from 'react';

// Componentes nativos usados na tela.
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  StatusBar, // controla a barra de status do celular (hora, bateria)
} from 'react-native';


// Validação simples de e-mail: texto + @ + texto + . + texto, sem espaços.
// Exemplo válido: aluno@escola.com
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function App() {
  // ----------------------------------------------------------
  // ESTADOS: um useState para cada campo do formulário.
  // O valor inicial é string vazia ('').
  // ----------------------------------------------------------
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');
  const [curso, setCurso] = useState('');

  // Estado com as mensagens de erro de cada campo. Ex.: { nome: 'Informe o nome.' }
  // Objeto vazio = nenhum erro.
  const [erros, setErros] = useState({});

  // ----------------------------------------------------------
  // VALIDAÇÃO: confere os dados e devolve um objeto com os erros.
  // Se o objeto voltar vazio, o formulário está válido.
  // ----------------------------------------------------------
  function validar() {
    const novosErros = {};

    // Nome é obrigatório. trim() ignora espaços em branco no começo/fim.
    if (nome.trim() === '') {
      novosErros.nome = 'O nome é obrigatório.';
    }

    // RA é obrigatório.
    if (ra.trim() === '') {
      novosErros.ra = 'O RA é obrigatório.';
    }

    // E-mail só é validado se foi preenchido (ele não é obrigatório).
    if (email.trim() !== '' && !REGEX_EMAIL.test(email.trim())) {
      novosErros.email = 'Digite um e-mail válido (ex.: aluno@escola.com).';
    }

    // Curso é opcional, então não precisa de validação.
    return novosErros;
  }

  // ----------------------------------------------------------
  // BOTÃO SALVAR: valida antes de mostrar a mensagem de sucesso.
  // ----------------------------------------------------------
  function handleSalvar() {
    const novosErros = validar();
    setErros(novosErros); // mostra os erros (ou limpa, se não houver)

    // Se existir algum erro, interrompe aqui e NÃO mostra sucesso.
    if (Object.keys(novosErros).length > 0) {
      return;
    }

    // Tudo certo: mensagem de sucesso com os dados cadastrados.
    Alert.alert(
      'Sucesso!',
      `Aluno cadastrado:\n\nNome: ${nome.trim()}\nRA: ${ra.trim()}` +
        (email.trim() ? `\nE-mail: ${email.trim()}` : '') +
        (curso.trim() ? `\nCurso: ${curso.trim()}` : '')
    );
  }

  // ----------------------------------------------------------
  // BOTÃO LIMPAR: restaura todos os campos e remove os erros.
  // ----------------------------------------------------------
  function handleLimpar() {
    setNome('');
    setEmail('');
    setRa('');
    setCurso('');
    setErros({});
  }

  // ----------------------------------------------------------
  // INTERFACE (o que aparece na tela)
  // ----------------------------------------------------------
  return (
    // KeyboardAvoidingView: empurra o conteúdo para cima quando o teclado abre,
    // para o teclado não cobrir os campos no Android/iOS.
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" />

      {/* ScrollView: permite rolar a tela em celulares pequenos.
          keyboardShouldPersistTaps="handled": os botões funcionam com 1 toque
          mesmo com o teclado aberto. */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>CadastroAluno</Text>

        {/* ---------- Campo NOME (obrigatório) ---------- */}
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          // Borda vermelha quando há erro neste campo.
          style={[styles.input, erros.nome && styles.inputErro]}
          value={nome} // valor vem do estado (campo controlado)
          onChangeText={setNome} // atualiza o estado a cada letra digitada
          placeholder="Digite seu nome completo"
          autoCapitalize="words" // primeira letra de cada palavra maiúscula
        />
        {/* Mensagem de erro logo abaixo do campo */}
        {erros.nome && <Text style={styles.msgErro}>{erros.nome}</Text>}

        {/* ---------- Campo E-MAIL (validação simples) ---------- */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, erros.email && styles.inputErro]}
          value={email}
          onChangeText={setEmail}
          placeholder="aluno@escola.com"
          keyboardType="email-address" // teclado com @ e . para e-mails
          autoCapitalize="none" // e-mail sem letra maiúscula automática
          autoCorrect={false} // desliga o corretor automático
        />
        {erros.email && <Text style={styles.msgErro}>{erros.email}</Text>}

        {/* ---------- Campo RA (obrigatório) ---------- */}
        <Text style={styles.label}>RA *</Text>
        <TextInput
          style={[styles.input, erros.ra && styles.inputErro]}
          value={ra}
          onChangeText={setRa}
          placeholder="Digite seu RA"
          keyboardType="numeric" // teclado numérico
        />
        {erros.ra && <Text style={styles.msgErro}>{erros.ra}</Text>}

        {/* ---------- Campo CURSO (opcional) ---------- */}
        <Text style={styles.label}>Curso</Text>
        <TextInput
          style={styles.input}
          value={curso}
          onChangeText={setCurso}
          placeholder="Ex.: Análise e Desenvolvimento de Sistemas"
          autoCapitalize="words"
        />

        {/* ---------- BOTÕES ---------- */}
        <View style={styles.linhaBotoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoSalvar]}
            onPress={handleSalvar}
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoLimpar]}
            onPress={handleLimpar}
          >
            <Text style={styles.textoBotao}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.nota}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================
// ESTILOS: aparência da tela (cores, espaçamentos, bordas)
// ============================================================
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F4F6FA' },
  container: { padding: 24, paddingTop: 64 },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F3A6E',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C9CED8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  // Aplicado ao campo quando há erro.
  inputErro: { borderColor: '#D32F2F' },
  // Texto da mensagem de erro (vermelho, abaixo do campo).
  msgErro: { color: '#D32F2F', fontSize: 13, marginTop: 4 },
  linhaBotoes: { flexDirection: 'row', gap: 12, marginTop: 28 },
  botao: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoSalvar: { backgroundColor: '#2E7D32' },
  botaoLimpar: { backgroundColor: '#757575' },
  textoBotao: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  nota: { marginTop: 16, color: '#666', fontSize: 12 },
});
