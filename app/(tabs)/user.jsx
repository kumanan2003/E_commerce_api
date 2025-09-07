import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { useCart } from "@/context/CartContext";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const UserPage = () => {
  const { purchaseHistory } = useCart();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  const handleUploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const file = result.assets[0];
        await user.setProfileImage({
          file: {
            uri: file.uri,
            name: "profile.jpg",
            type: "image/jpeg",
          },
        });
        await user.reload(); // refresh user data
        setUploading(false);
        Alert.alert("Success", "Profile photo updated!");
      } catch (err) {
        setUploading(false);
        Alert.alert("Error", "Failed to upload photo");
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.profileImage}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text style={styles.userName}>{user?.fullName || "User"}</Text>
        <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={handleUploadPhoto}
          disabled={uploading}
        >
          <Text style={styles.uploadText}>
            {uploading ? "Uploading..." : "Upload Photo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Full Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>

          {/* Full Image */}
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.fullImage}
            contentFit="cover" // fill the container while keeping aspect ratio
          />
        </View>
      </Modal>


      {/* Orders Section */}
      <Text style={styles.ordersHeader}>My Orders</Text>
      {purchaseHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={purchaseHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderDate}>📅 {item.date}</Text>

              {item.items.map((product) => (
                <View key={product.id} style={styles.itemRow}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.itemImage}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.itemTitle}>{product.title}</Text>
                    <Text style={styles.itemQty}>
                      {product.quantity} × ${product.price}
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    ${(product.price * product.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

              <View style={styles.orderFooter}>
                <Text style={styles.totalText}>Total: ${item.total.toFixed(2)}</Text>
                <Text style={styles.methodText}>💳 {item.method}</Text>
                <Text style={styles.statusText}>📦 {item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  profileSection: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: "center",
  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    borderRadius: 16,
  },
  ordersHeader: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 16, color: COLORS.textLight, marginTop: 8 },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  orderId: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  orderDate: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: COLORS.border },
  itemTitle: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  itemQty: { fontSize: 13, color: COLORS.textLight },
  itemTotal: { fontSize: 14, fontWeight: "bold", color: COLORS.primary },
  orderFooter: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    paddingTop: 8,
  },
  totalText: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  methodText: { fontSize: 13, color: COLORS.text },
  statusText: { fontSize: 13, fontWeight: "600", color: COLORS.primary, marginTop: 4 },
});



