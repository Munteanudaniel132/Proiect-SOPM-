// Login.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Login eșuat. Verifică emailul și parola.");
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.errorBox}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Parolă..."
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A40",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2A2A5A",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#8758ff",
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#8758ff",
    paddingVertical: 12,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
    marginBottom: 15,
    fontWeight: "600",
  },
});
