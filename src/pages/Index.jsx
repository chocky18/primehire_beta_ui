import React from "react";
import Header from "@/common/Header";
import MainContent from "@/components/MainContent";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ChatInput from "@/chat/ChatInput";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMainContent } from "@/hooks/useMainContent";

import "@/components/AppSidebar/AppSidebar.css";
import "@/styles/layout.css";

export default function Index() {
  const main = useMainContent();

  return (
    <SidebarProvider>

      {/* HEADER */}
      <Header onRefresh={main.handleRefresh} />

      {/* LAYOUT */}
      <div className="ph-layout">

        {/* SIDEBAR */}
        <aside className="ph-sidebar">
          <AppSidebar
            selectedFeature={main.selectedFeature}
            onFeatureSelect={main.handleFeatureClick}
          />
        </aside>

        {/* MAIN AREA */}
        <main className="ph-main">

          {/* SCROLLABLE CONTENT */}
          <div className="ph-main-scroll">
            <MainContent {...main} />
          </div>

          {/* FIXED CHAT INPUT */}
          {/* <div className="ph-main-chatinput">
            <ChatInput
              onSend={main.handleSend}
              activeTask={main.selectedTask}
              forceShowChips={true}
            />
          </div> */}

        </main>
      </div>
    </SidebarProvider>
  );
}
