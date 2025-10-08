import {
  AppShell,
  MantineProvider,
  Text,
  Button,
  Group,
  ActionIcon,
  useMantineColorScheme,
  Stack,
  Anchor,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Notifications, notifications } from "@mantine/notifications";
import {
  IconSun,
  IconMoon,
  IconBrandPatreon,
  IconCheck,
  IconX,
  IconLogout,
} from "@tabler/icons-react";
import "./App.css";
import { theme } from "./theme";

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
        id: "sign-out-loading",
        loading: true,
        title: "Signing out",
        message: "Clearing data and cookies...",
        autoClose: false,
        withCloseButton: false,
      });

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        notifications.update({
          id: "sign-out-loading",
          color: "red",
          title: "Error",
          message: "No active tab found",
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
            id: "sign-out-loading",
            color: "green",
            title: "Success",
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
        id: "sign-out-loading",
        color: "red",
        title: "Error",
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
      <Group justify="center" gap="md">
        <Anchor
          href="https://www.patreon.com/TylorMayfield"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          size="sm"
        >
          <Group gap="xs">
            <IconBrandPatreon size={16} />
            <Text>Support on Patreon</Text>
          </Group>
        </Anchor>
        <ActionIcon
          variant="outline"
          color={dark ? "yellow" : "blue"}
          onClick={toggleColorScheme}
          title={`Switch to ${dark ? "light" : "dark"} mode`}
        >
          {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
      </Group>
    );
  }

  return (
    <MantineProvider
      theme={{ ...theme, colorScheme: preferredColorScheme }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position="top-center" zIndex={1000} />
      <AppShell padding="md" header={{ height: 60 }} footer={{ height: 60 }}>
        <AppShell.Header>
          <Group justify="space-between" style={{ padding: "0 20px", height: "100%" }}>
            <Group>
              <IconLogout size={24} />
              <Text size="xl" fw={500}>
                Universal Sign Out
              </Text>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <Stack align="center" gap="lg">
            <Text size="sm" ta="center">
              Clicking the button below will sign you out of the current website
              by clearing cookies and other site data.
            </Text>
            <Button
              size="lg"
              onClick={handleSignOut}
              color="red"
              fullWidth
              variant="outline"
              leftSection={<IconLogout size={20} />}
              style={{
                maxWidth: "400px",
              }}
            >
              Sign Out
            </Button>
          </Stack>
        </AppShell.Main>
        <AppShell.Footer p="md">
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
