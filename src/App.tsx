import React, { useState, useEffect } from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  ChatWidget,
  Navigation,
  Footer,
} from "./components";
import FadeIn from './components/FadeIn';
import './index.scss';

function App() {
    const [chatOpen, setChatOpen] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);

    return (
    <div className="main-container">
        <Navigation onAskChetan={() => setChatOpen(true)} />
        <FadeIn transitionDuration={700}>
            <Main onAskChetan={() => setChatOpen(true)} />
            <Expertise/>
            <Timeline/>
            <Project/>
            <Contact/>
        </FadeIn>
        <Footer />
        <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </div>
    );
}

export default App;
