import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ToggleSwitch } from './components/ToggleSwitch';
import { Slider } from './components/Slider';
import { ModSection } from './components/ModSection';
import { GeminiFeature } from './components/GeminiFeature';
import type { AiFeature } from './types';
import { generateSlitherContent } from './services/geminiService';
import { Header } from './components/Header';
import { Notification } from './components/Notification';

const App: React.FC = () => {
    // Mod state
    const [godMode, setGodMode] = useState<boolean>(false);
    const [speedBoost, setSpeedBoost] = useState<number>(1.5);
    const [zoomLevel, setZoomLevel] = useState<number>(1.0);
    const [showMap, setShowMap] = useState<boolean>(true);
    const [autoPilot, setAutoPilot] = useState<boolean>(false);

    // Gemini AI state
    const [geminiInput, setGeminiInput] = useState<string>('');
    const [geminiOutput, setGeminiOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [notification, setNotification] = useState<string | null>(null);
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleGenerate = useCallback(async (feature: AiFeature, prompt: string) => {
        setIsLoading(true);
        setError(null);
        setGeminiOutput('');
        try {
            const result = await generateSlitherContent(prompt, feature);
            setGeminiOutput(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate content: ${errorMessage}`);
            showNotification(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!panelRef.current) return;
        // Allow dragging only from the header, not from buttons inside it.
        if (e.target instanceof HTMLElement && e.target.closest('button')) {
            return;
        }
        setIsDragging(true);
        const rect = panelRef.current.getBoundingClientRect();
        dragStartOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragStartOffset.current.x,
                y: e.clientY - dragStartOffset.current.y,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };
        
        // Add event listeners to the window to allow dragging outside the panel
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="w-screen h-screen overflow-hidden">
             <iframe
                src="http://slither.io"
                title="Slither.io Game"
                className="absolute top-0 left-0 w-full h-full border-0 z-0"
                aria-hidden="true"
            />

            {!isPanelVisible && (
                 <button 
                    onClick={() => setIsPanelVisible(true)}
                    className="fixed top-5 left-5 z-20 bg-dark-panel-accent p-3 rounded-full text-neon-green shadow-neon-cyan hover:scale-110 transition-transform"
                    aria-label="Open Mod Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                 </button>
            )}
            
            <div
                ref={panelRef}
                className={`fixed w-full max-w-4xl bg-dark-panel border-2 border-dark-panel-accent rounded-lg shadow-neon-cyan overflow-hidden transform transition-opacity duration-300 ${isPanelVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ top: `${position.y}px`, left: `${position.x}px`, zIndex: 10 }}
            >
                <Header onMouseDown={handleMouseDown} onToggleVisibility={() => setIsPanelVisible(false)} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-dark-panel-accent">
                    <div className="bg-dark-panel p-6 flex flex-col gap-6">
                        <ModSection title="Player Mods">
                            <ToggleSwitch label="God Mode (Invincible)" enabled={godMode} onChange={() => { setGodMode(!godMode); showNotification(`God Mode ${!godMode ? 'Enabled' : 'Disabled'}`); }} />
                            <ToggleSwitch label="Auto Pilot Bot" enabled={autoPilot} onChange={() => { setAutoPilot(!autoPilot); showNotification(`Auto Pilot ${!autoPilot ? 'Enabled' : 'Disabled'}`); }} />
                            <Slider label={`Speed Boost: ${speedBoost}x`} value={speedBoost} onChange={(e) => setSpeedBoost(parseFloat(e.target.value))} min={1} max={5} step={0.1} />
                        </ModSection>

                        <ModSection title="Visual Mods">
                            <ToggleSwitch label="Show Player Locations" enabled={showMap} onChange={() => { setShowMap(!showMap); showNotification(`Map Locations ${!showMap ? 'Enabled' : 'Disabled'}`); }} />
                            <Slider label={`Zoom Level: ${zoomLevel.toFixed(1)}x`} value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} min={0.5} max={3} step={0.1} />
                        </ModSection>
                    </div>

                    <div className="bg-dark-panel p-6">
                         <GeminiFeature
                            input={geminiInput}
                            setInput={setGeminiInput}
                            output={geminiOutput}
                            isLoading={isLoading}
                            error={error}
                            onGenerate={handleGenerate}
                        />
                    </div>
                </div>
            </div>

            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
        </div>
    );
};

export default App;
