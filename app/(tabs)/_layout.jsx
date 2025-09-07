import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, Tabs } from "expo-router";
import { COLORS } from '../../constants/colors'

const TabsLayout = () =>{
    const {isSignedIn} = useAuth()

    if(!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />
    
    return <Tabs
    screenOptions={{
        headerShown:false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600"
        },
    }}
    >

        <Tabs.Screen
        name="index"
        options={{
            title:"Home",
            tabBarIcon: ({color, size}) => <Ionicons name="home" size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name="search"
        options={{
            title:"search",
            tabBarIcon: ({color, size}) => <Ionicons name="search" size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name="payment"
        options={{
            title:"pay",
            tabBarIcon: ({color, size}) => <Ionicons name="cash" size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name="itemcart"
        options={{
            title:"itemcart",
            tabBarIcon: ({color, size}) => <Ionicons name="cart" size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name="user"
        options={{
            title:"user",
            tabBarIcon: ({color, size}) => <Ionicons name="person" size={size} color={color} />
        }}
        />
    </Tabs>;
}

export default TabsLayout;