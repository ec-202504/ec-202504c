import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// UI統一: 角丸・影・primary色アクセント・フォント・余白などを統一
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          color: "var(--primary)",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      duration={3000}
      closeButton={false}
      richColors={false}
      expand={false}
      {...props}
    />
  );
};

export { Toaster };
