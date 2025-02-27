import {
  MantineProvider,
  Text,
  Button,
  Group,
  Box,
  ActionIcon,
  useMantineColorScheme,
  NavLink,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Notifications, notifications } from '@mantine/notifications';
import {
  IconSun,
  IconMoon,
  IconBrandGithub,
  IconBrandPatreon,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import "./App.css";

function App() {
  const preferredColorScheme = useColorScheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    defaultValue: preferredColorScheme,
  });
  const dark = colorScheme === "dark";

  const handleSignOut = async () => {
    try {
      // Show loading notification
      notifications.show({
        id: 'sign-out-loading',
        loading: true,
        title: 'Signing out',
        message: 'Clearing data and cookies...',
        autoClose: false,
        withCloseButton: false,
      });

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        notifications.update({
          id: 'sign-out-loading',
          color: 'red',
          title: 'Error',
          message: 'No active tab found',
          icon: <IconX size="1rem" />,
          autoClose: 3000,
          withCloseButton: true,
        });
        return;
      }

      const url = new URL(tab.url);
      const domain = url.hostname;

      // Special handling for Google services
      if (
        url.hostname.includes("google.com") ||
        url.hostname.includes("youtube.com")
      ) {
        window.location.href = "https://accounts.google.com/Logout";
        return;
      }

      chrome.browsingData.remove(
        {
          origins: [`${url.protocol}//${domain}`],
        },
        {
          cookies: true,
          localStorage: true,
          cache: true,
          indexedDB: true,
          serviceWorkers: true,
          webSQL: true,
        },
        () => {
          // Update notification to success
          notifications.update({
            id: 'sign-out-loading',
            color: 'green',
            title: 'Success',
            message: `Signed out from ${domain}`,
            icon: <IconCheck size="1rem" />,
            autoClose: 3000,
            withCloseButton: true,
          });
          
          // Reload the tab
          chrome.tabs.reload(tab.id);
        }
      );
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Show error notification
      notifications.update({
        id: 'sign-out-loading',
        color: 'red',
        title: 'Error',
        message: `Failed to sign out: ${error.message}`,
        icon: <IconX size="1rem" />,
        autoClose: 3000,
        withCloseButton: true,
      });
    }
  };

  function Footer() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
      <footer
        style={{
          marginTop: "auto",
          padding: "10px",
          textAlign: "center",
          fontSize: "14px",
          color: "#aaa",
          borderTop: "1px solid #ddd",
        }}
      >
        <Group align="center" justify="center" spacing="md">
          <a
            href="https://www.patreon.com/TylorMayfield"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }} // Optional: to remove underline
          >
            <Text
              size="sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <IconBrandPatreon
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              />
              Support on Patreon
            </Text>
          </a>
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={toggleColorScheme}
            title={`Switch to ${dark ? "light" : "dark"} mode`}
            style={{ borderRadius: "50%", padding: "8px" }}
          >
            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>
      </footer>
    );
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: preferredColorScheme,
        headings: { fontWeight: 500 },
        components: {
          Button: {
            styles: (theme) => ({
              root: {
                borderRadius: theme.radius.md,
              },
            }),
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position="top-center" zIndex={1000} />
      <Box
        style={{
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "auto",
          minWidth: "300px",
          maxWidth: "600px",
          margin: "0 auto",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Button
          size="lg"
          onClick={handleSignOut}
          color="red"
          fullWidth
          style={{
            maxWidth: "400px",
            marginBottom: "20px",
          }}
        >
          Sign Out
        </Button>
        <Footer />
      </Box>
    </MantineProvider>
  );
}

export default App;
