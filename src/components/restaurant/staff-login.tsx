import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRestaurantState } from "@/components/restaurant/restaurant-state";
import { StaffRole } from "@/data/mock-restaurant";

const roles: { value: StaffRole; label: string; detail: string }[] = [
  { value: "waiter", label: "Waiter", detail: "Orders and kitchen updates" },
  { value: "kitchen", label: "Kitchen", detail: "Kitchen tickets and status" },
  { value: "admin", label: "Admin", detail: "All app areas and sales" },
];

const colors = {
  ink: "#173840",
  muted: "#58777D",
  paper: "#F1FAF8",
  white: "#FFFFFF",
  line: "#D4E9E7",
  green: "#21886B",
  paleGreen: "#E2F4EA",
  blue: "#48AFCF",
  paleBlue: "#E4F5FB",
};

export function StaffLogin() {
  const { setRole, setStaffName } = useRestaurantState();
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<StaffRole>("waiter");

  function signIn() {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    setStaffName(normalizedName);
    setRole(selectedRole);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>M</Text>
          </View>
          <Text style={styles.brandName}>MEHAR JUICE</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.eyebrow}>STAFF ACCESS</Text>
          <Text style={styles.title}>Sign in to service</Text>
          <Text style={styles.subtitle}>
            Choose your role to open the right workspace.
          </Text>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.muted}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="done"
          />
          <Text style={[styles.label, styles.roleLabel]}>WORKSPACE</Text>
          <View style={styles.roles}>
            {roles.map((role) => (
              <Pressable
                key={role.value}
                onPress={() => setSelectedRole(role.value)}
                style={[
                  styles.role,
                  selectedRole === role.value && styles.roleSelected,
                ]}
              >
                <View
                  style={[
                    styles.roleIndicator,
                    selectedRole === role.value && styles.roleIndicatorSelected,
                  ]}
                />
                <View style={styles.roleCopy}>
                  <Text style={styles.roleName}>{role.label}</Text>
                  <Text style={styles.roleDetail}>{role.detail}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          <Pressable
            disabled={!name.trim()}
            onPress={signIn}
            style={[styles.submit, !name.trim() && styles.submitDisabled]}
          >
            <Text style={styles.submitText}>Continue</Text>
            <Text style={styles.submitArrow}>→</Text>
          </Pressable>
        </View>
        <Text style={styles.footer}>STAFF WORKSPACE · DEMO SIGN-IN</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  brand: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: { color: colors.white, fontSize: 23, fontWeight: "800" },
  brandName: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  form: { paddingVertical: 32 },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: { color: colors.ink, fontSize: 32, fontWeight: "800", marginTop: 8 },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 9,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.ink,
  },
  roleLabel: { marginTop: 24 },
  roles: { gap: 9 },
  role: {
    minHeight: 66,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roleSelected: { backgroundColor: colors.paleBlue, borderColor: colors.blue },
  roleIndicator: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.muted,
    borderRadius: 9,
  },
  roleIndicatorSelected: { borderWidth: 5, borderColor: colors.green },
  roleCopy: { flex: 1 },
  roleName: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  roleDetail: { color: colors.muted, fontSize: 13, marginTop: 3 },
  submit: {
    minHeight: 54,
    marginTop: 22,
    borderRadius: 9,
    backgroundColor: colors.green,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 11,
  },
  submitDisabled: { opacity: 0.45 },
  submitText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  submitArrow: { color: colors.white, fontSize: 19 },
  footer: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingBottom: 18,
    textAlign: "center",
  },
});
