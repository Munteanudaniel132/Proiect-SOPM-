// Register.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");
    try {
      await signup(email, password);
    } catch (err) {
      console.error(err);
      setError("Înregistrarea a eșuat. Verifică datele.");
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Register</Text>

      {error ? <Text style={styles.errorBox}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Parolă..."
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
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
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2A2A5A",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#8758ff",
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#8758ff",
    padding: 12,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
});
