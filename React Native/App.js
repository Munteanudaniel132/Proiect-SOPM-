import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
// MODIFICARE: Importăm SafeAreaView și SafeAreaProvider din biblioteca dedicată
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import TodoWrapperFirebase from "./TodoWrapperFirebase";

function AppContent() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    {/* --- AICI ADAUGI TITLUL --- */}
                    <Text style={styles.appTitle}>Task Manager</Text>
                    <Text style={styles.appSubtitle}>Organizează-ți ziua mai eficient</Text>
                    {/* -------------------------- */}

                    <View style={styles.section}>
                        <Login />
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>SAU</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.section}>
                        <Register />
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }

    return <TodoWrapperFirebase />;
}


// Stilurile care fac magia să se întâmple
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F2D", // Match cu fundalul tău din Task Manager
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  section: {
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#444",
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 12,
    },
    appTitle: {
        fontSize: 36,
        color: "white", 
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    appSubtitle: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginBottom: 30, // Spațiu până la primul card (Login)
    },
});

export default function App() {
    return (
        // MODIFICARE: Am adăugat SafeAreaProvider pentru a inițializa contextul de siguranță
        <SafeAreaProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </SafeAreaProvider>
    );
}