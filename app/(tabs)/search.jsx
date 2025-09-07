import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useDebounce } from "../../hooks/useDebounce";
import  Constants from 'expo-constants'

const API_KEY = Constants.expoConfig.extra.API_KEY;

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const fetchProducts = async (query) => {
    try {
      setLoading(true);

      let url = `${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      const transformed = data.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category || "Other",
        image: p.image || "https://via.placeholder.com/300x300.png?text=No+Image",
      }));

      // filter by query
      const filtered = query
        ? transformed.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase())
          )
        : transformed;

      setProducts(filtered.slice(0, 20)); // limit results
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
        </Text>
        <Text style={styles.resultsCount}>{products.length} found</Text>
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="contain"
              />
              <View style={styles.cardContent}>
                <Text numberOfLines={2} style={styles.title}>
                  {item.title}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyDescription}>
                Try adjusting your search or using different keywords
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 14,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultsTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  resultsCount: { fontSize: 14, color: COLORS.textLight },
  card: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 140, backgroundColor: COLORS.border },
  cardContent: { padding: 10 },
  title: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary, marginTop: 4 },
  emptyState: { alignItems: "center", marginTop: 40, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginTop: 12 },
  emptyDescription: { fontSize: 14, color: COLORS.textLight, textAlign: "center", marginTop: 6 },
});
