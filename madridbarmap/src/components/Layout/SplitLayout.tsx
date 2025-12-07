import { ReactNode } from "react";

interface SplitLayoutProps {
    children: [ReactNode, ReactNode]; // [Map, Panel]
}

export default function SplitLayout({ children }: SplitLayoutProps) {
    const [mapComponent, panelComponent] = children;

    return (
        <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
            {/* Map Section - Always Full Screen Background */}
            <div className="absolute inset-0 z-0">
                {mapComponent}
            </div>

            {/* Panel Section - Floating Overlay */}
            {/* Desktop: Floating Sidebar on Left */}
            {/* Mobile: Bottom Sheet */}
            <div className="
                absolute 
                
                // Desktop: Sidebar style
                md:top-4 md:left-4 md:bottom-4 md:w-[400px] 
                md:bg-white md:dark:bg-zinc-900 
                md:rounded-xl md:shadow-xl md:border md:border-zinc-200 md:dark:border-zinc-800
                md:overflow-hidden md:flex md:flex-col

                // Mobile: Bottom Sheet style
                bottom-0 left-0 right-0 
                h-[45vh] md:h-auto
                bg-white dark:bg-zinc-900 
                rounded-t-3xl md:rounded-xl
                shadow-[0_-8px_30px_rgba(0,0,0,0.12)]
                border-t md:border-t-0 border-zinc-200 dark:border-zinc-800 
                
                z-20
                flex flex-col
                transition-all duration-300 ease-in-out
                pointer-events-auto
            ">
                {/* Mobile Handle */}
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-12 h-1.5 bg-zinc-300 rounded-full"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {panelComponent}
                </div>
            </div>
        </div>
    );
}
