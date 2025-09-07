import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, Dimensions, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useCart } from '../../context/CartContext';
import BuyNowButton from "../../components/BuyNowButton";
import Constants from 'expo-constants';

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;
const API_KEY = Constants.expoConfig.extra.API_KEY;

const HomeScreen = () => {
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart, setCheckoutItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_KEY}/products`);
      const data = await res.json();

      const fetchedProducts = data.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category || "Other",
        price: p.price,
        image: p.image || "https://via.placeholder.com/300x300.png?text=No+Image",
      }));

      const uniqueCategories = [...new Set(fetchedProducts.map((p) => p.category))];

      setProducts(fetchedProducts);
      setCategories(uniqueCategories);
      setFeaturedProduct(fetchedProducts[0] || null);
      if (!selectedCategory && uniqueCategories.length > 0) setSelectedCategory(uniqueCategories[0]);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryProducts = (category) => {
    const filtered = products.filter((p) => p.category === category);
    setProducts(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    loadCategoryProducts(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={homeStyles.loading}>
        <Text style={{ color: COLORS.text }}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Featured Product */}
        {featuredProduct && (
          <TouchableOpacity style={homeStyles.bannerCard} onPress={() => router.push(`/product/${featuredProduct.id}`)}>
            <Image source={{ uri: featuredProduct.image }} style={homeStyles.bannerImage} contentFit="cover" />
            <View style={homeStyles.bannerOverlay}>
              <Text style={homeStyles.bannerTitle}>{featuredProduct.title}</Text>
              <Text style={homeStyles.bannerSubtitle}>Just ${featuredProduct.price}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.categoryFilterScrollContent}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[homeStyles.categoryButton, selectedCategory === cat && homeStyles.selectedCategory]}
              onPress={() => handleCategorySelect(cat)}
            >
              <Text style={[homeStyles.categoryText, selectedCategory === cat && homeStyles.selectedCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={homeStyles.productsSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={({ item }) => {
                const isInCart = cartItems.some((ci) => ci.id === item.id);

                return (
                  <View>
                    <TouchableOpacity
                      style={homeStyles.productCard}
                      onPress={() => router.push(`/product/${item.id}`)}
                    >
                      <View style={homeStyles.imageContainer}>
                        <Image
                          source={{ uri: item.image }}
                          style={homeStyles.image}
                          contentFit="contain"
                        />
                      </View>

                      <View style={homeStyles.content}>
                        <Text numberOfLines={2} style={homeStyles.title}>
                          {item.title}
                        </Text>
                        <Text style={homeStyles.price}>${item.price}</Text>

                        {/* Add to Cart / Wishlist */}
                        <TouchableOpacity
                          style={homeStyles.addToCartButton}
                          onPress={() => {
                            if (isInCart) {
                              removeFromCart(item.id);
                              Alert.alert("Removed", `${item.title} has been removed from your cart.`);
                            } else {
                              addToCart(item);
                              Alert.alert("Added", `${item.title} has been added to your cart.`);
                            }
                          }}
                        >
                          <Ionicons
                            name={isInCart ? "heart" : "heart-outline"}
                            size={20}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>

                      <BuyNowButton product={item} />

                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.productsGrid}
              scrollEnabled={false}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="cart-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No products found</Text>
              <Text style={homeStyles.emptyDescription}>Try another category</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 32 },
  bannerCard: { borderRadius: 20, overflow: "hidden", backgroundColor: COLORS.primary, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 14, elevation: 8 },
  bannerImage: { width: "100%", height: 200 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end", padding: 16 },
  bannerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.white },
  bannerSubtitle: { fontSize: 14, color: COLORS.white, marginTop: 4 },
  productsSection: { paddingHorizontal: 20, marginTop: 8 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text, letterSpacing: -0.5 },
  productsGrid: { gap: 16 },
  row: { justifyContent: "space-between", gap: 16 },
  productCard: { width: cardWidth, backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 16, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, overflow: "hidden" },
  imageContainer: { position: "relative", height: 160 },
  image: { width: "100%", height: "100%", backgroundColor: COLORS.border },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 4, lineHeight: 20 },
  price: { fontSize: 14, fontWeight: "700", color: COLORS.primary, marginBottom: 6 },
  bookmarkBtn: { position: 'absolute', right: 10, bottom: 200, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 30 },
  addToCartButton: { alignItems: "flex-end", justifyContent: "flex-end", right: 10, bottom: 24 },
  buyNowButton: { backgroundColor: COLORS.primary, paddingVertical: 4, borderRadius: 8, marginTop: 6, alignItems: "center", top: 34 },
  buyNowText: { color: COLORS.white, fontWeight: "700", fontSize: 14 },
  emptyState: { alignItems: "center", paddingVertical: 64, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginTop: 16, marginBottom: 8, letterSpacing: 1.1 },
  emptyDescription: { fontSize: 14, color: COLORS.textLight, textAlign: "center" },
  categoryFilterScrollContent: { paddingHorizontal: 16, gap: 12 },
  categoryButton: { flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.card, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, minWidth: 80, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  selectedCategory: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, shadowOpacity: 0.15 },
  categoryText: { fontSize: 12, fontWeight: "600", color: COLORS.text, textAlign: "center" },
  selectedCategoryText: { color: COLORS.white },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});






