import {
  MantineProvider,
  Text,
  Button,
  Group,
  Box,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import {
  IconSun,
  IconMoon,
  IconBrandGithub,
  IconBrandChrome,
} from "@tabler/icons-react";
import "./App.css";

function App() {
  const preferredColorScheme = useColorScheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    defaultValue: preferredColorScheme,
  });
  const dark = colorScheme === "dark";

  const showNotification = () => {
    notifications.show({
      title: "Hello!",
      message: "This is a Mantine notification",
      color: "blue",
    });
  };

  const handleSignOut = async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        notifications.show({
          title: "Error",
          message: "No active tab found.",
          color: "red",
        });
        return;
      }

      const url = new URL(tab.url);

      if (
        url.hostname.includes("google.com") ||
        url.hostname.includes("youtube.com")
      ) {
        chrome.tabs.update(tab.id, {
          url: "https://accounts.google.com/Logout",
        });
        return;
      }

      // Execute script to clear storage and cookies
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          try {
            // Clear local storage
            localStorage.clear();

            // Clear session storage
            sessionStorage.clear();

            // Clear cookies
            document.cookie.split(";").forEach((cookie) => {
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
              document.cookie =
                name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });

            // Reload the page
            window.location.reload();
          } catch (error) {
            console.error("Error clearing storage or reloading:", error);
          }
        },
      });

      chrome.tabs.reload(tab.id);
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  function Footer() {
    return (
      <footer
        style={{
          marginTop: "auto",
          padding: "5px",
          textAlign: "center",
          fontSize: "smaller",
          color: "#888",
        }}
      >
        <Group align="center" justify="center" spacing="sm">
          <Text
            size="xs"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <a
              href="https://github.com/TylorMayfield/crx-template"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: "5px" }}
            >
              <IconBrandGithub />
            </a>
            <a
              href="https://chromewebstore.google.com/detail/chrome-extension-template/mechhnlbchididihbgadhfokjnbhfbed"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandChrome />
            </a>
          </Text>
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={toggleColorScheme}
          >
            {dark ? <IconSun /> : <IconMoon />}
          </ActionIcon>
        </Group>
      </footer>
    );
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: preferredColorScheme,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Box
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "300px",
          minHeight: "100px",
        }}
      >
        <Notifications position="top-center" />
        <Button size="lg" onClick={handleSignOut} color="red" fullWidth>
          Sign Out
        </Button>
      </Box>
      <Footer />
    </MantineProvider>
  );
}

export default App;
