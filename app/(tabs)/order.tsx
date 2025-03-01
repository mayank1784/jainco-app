import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Order, OrderStatus } from "@/lib/types";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";

interface OrderWithId extends Order {
  id: string;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
      <Text className="text-sm font-medium">{status}</Text>
    </View>
  );
};

const OrderDetailsModal: React.FC<{
  visible: boolean;
  order: OrderWithId | null;
  onClose: () => void;
}> = ({ visible, order, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-4/5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Order Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.close}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Order ID</Text>
              <Text className="text-gray-600">{order.id}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Status</Text>
              <OrderStatusBadge status={order.status} />
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Items</Text>
              {order.items.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center border-b border-gray-200 py-2"
                >
                  <Image
                    source={{ uri: item.productMainImage }}
                    className="w-16 h-16 rounded-lg mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-medium">{item.productName}</Text>
                    <Text className="text-gray-600">
                      Quantity: {`${item.qty} × ₹${item.price} = ₹${item.amount}`}
                    </Text>
                    <Text className="text-gray-600">SKU: {item.sku}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Total Amount</Text>
              <Text className="text-2xl text-green-600">
                ₹{order.totalAmount}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Order Date</Text>
              <Text className="text-gray-600">
                {new Date(order.createdAt.seconds * 1000).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const OrderScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const fetchOrders = async () => {
    if (!currentUser) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", currentUser.uid),
        where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const ordersData: OrderWithId[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as OrderWithId);
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, [currentUser]);

  const renderOrderCard = ({ item: order }: { item: OrderWithId }) => (
    <View
      className="bg-white p-4 rounded-lg mb-4 shadow"
     
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-gray-600">
          Order #{order.id.slice(-6)}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-medium">
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </Text>
        <Text className="text-lg font-semibold">₹{order.totalAmount}</Text>
      </View>
      <View className="flex-row justify-between items-center mb-2">
      <Text className="text-sm text-gray-600">
        {new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
      <CustomButton title="View Details" handlePress={()=>setSelectedOrder(order)} containerStyles="min-h-[20px] px-3 py-2"/>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-150 w-full">
         <View className="border-b border-gray-200 pt-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image 
              source={images.logo} 
              className="w-14 h-14 mr-4" 
              resizeMode="contain"
            />
            <Text className="text-xl font-bold">My Orders</Text>
          </View>
          <Text className="text-base font-iregular">
            {`${new Date(thirtyDaysAgo).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })} - Now`}
          </Text>
        </View>
      </View>
      <View className="flex-1 p-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading orders...</Text>
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(order) => order.id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-600">No orders found</Text>
        </View>
      )}
</View>
      <OrderDetailsModal
        visible={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;
