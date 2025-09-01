import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/80 backdrop-blur-xl border-red-500/30 shadow-2xl shadow-red-500/20",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-gray-300",
              formButtonPrimary:
                "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25",
              formFieldInput:
                "bg-white/5 border-red-500/30 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20 transition-all duration-300",
              formFieldLabel: "text-gray-300 font-medium",
              footerActionLink:
                "text-red-400 hover:text-red-300 transition-colors duration-300",
              dividerLine: "bg-red-500/30",
              dividerText: "text-gray-300 bg-black/80 px-4",
              formFieldInputShowPasswordButton:
                "text-gray-400 hover:text-red-400 transition-colors duration-300",
              formFieldInputShowPasswordButtonIcon:
                "text-gray-400 hover:text-red-400 transition-colors duration-300",
              socialButtonsBlockButton:
                "bg-white/10 border-red-500/30 text-white hover:bg-red-500/20 transition-all duration-300",
              socialButtonsBlockButtonText: "text-white",
              formFieldInputShowPasswordButtonIcon:
                "text-gray-400 hover:text-red-400 transition-colors duration-300",
            },
            variables: {
              colorPrimary: "#ef4444",
              colorText: "#ffffff",
              colorTextSecondary: "#d1d5db",
              colorBackground: "rgba(0, 0, 0, 0.8)",
              colorInputBackground: "rgba(255, 255, 255, 0.05)",
              colorInputText: "#ffffff",
              colorInputPlaceholderText: "#9ca3af",
              colorNeutral: "#6b7280",
              colorSuccess: "#10b981",
              colorWarning: "#f59e0b",
              colorDanger: "#ef4444",
              borderRadius: "0.5rem",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: {
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
