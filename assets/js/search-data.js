// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "publications by categories in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research on decision-making under uncertainty, and the tools built to test it against the real world.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Welcome to my page 🎉🎉 Get to know me more!",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-news",
          title: "News",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "post-part-8-exposing-bit-and-packet-error-rate",
        
          title: "Part 8. Exposing Bit and Packet Error Rate",
        
        description: "Veins already computes packet and bit error rate internally and throws them away. A small patch gets them back.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeErrorRates/";
          
        },
      },{id: "post-part-7-reporting-channel-quality-back",
        
          title: "Part 7. Reporting Channel Quality Back",
        
        description: "Turning received signal strength into a live table your own system can query at any time.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeChannelReport/";
          
        },
      },{id: "post-part-6-bootstrapping-the-world-from-openstreetmap",
        
          title: "Part 6. Bootstrapping the World from OpenStreetMap",
        
        description: "Deriving map bounds and building obstacles from a plain OSM file, no SUMO network required.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeOsmWorld/";
          
        },
      },{id: "post-part-5-your-own-node-manager",
        
          title: "Part 5. Your Own Node Manager",
        
        description: "Spawning and despawning vehicle modules dynamically, the job TraCIScenarioManager normally does for you.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeNodeManager/";
          
        },
      },{id: "post-part-4-the-step-loop",
        
          title: "Part 4. The Step Loop",
        
        description: "Letting OMNeT++ pull a fresh position snapshot on its own clock instead of getting pushed to on someone else&#39;s.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeStepLoop/";
          
        },
      },{id: "post-part-3-your-first-omnet-module",
        
          title: "Part 3. Your First OMNeT++ Module",
        
        description: "A minimal simple module that connects out to your bridge, receives the handshake, and says hello back.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeFirstModule/";
          
        },
      },{id: "post-part-2-a-length-prefixed-json-protocol",
        
          title: "Part 2. A Length Prefixed JSON Protocol",
        
        description: "Framing messages over a raw TCP socket so both sides always agree on where one message ends and the next begins.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeWireProtocol/";
          
        },
      },{id: "post-part-1-the-minimal-contract",
        
          title: "Part 1. The Minimal Contract",
        
        description: "What Veins actually needs from an external position source, and a toy ROS node that plays the part.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/veinsBridgeMinimalContract/";
          
        },
      },{id: "post-ucb-under-gradual-distribution-decay",
        
          title: "UCB Under Gradual Distribution Decay",
        
        description: "Investigating how UCB exploration parameters interact with different rates of gradual arm quality degradation",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ucbDynamic/";
          
        },
      },{id: "post-ucb-under-non-stochastic-enviroment",
        
          title: "UCB Under Non-stochastic Enviroment",
        
        description: "Exploring how UCB algorithms adapt when arm reward distributions suddenly shift in non-stationary environments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ucbShift/";
          
        },
      },{id: "post-ucb-exploration-in-sparse-rewarded-bandits",
        
          title: "UCB Exploration in Sparse Rewarded Bandits",
        
        description: "Investigating how UCB hyperparameter affects arm selection when dealing with sparse reward distributions in stochastic multi-armed bandits",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ucbTest/";
          
        },
      },{id: "post-mab-a-introduction",
        
          title: "MAB: A Introduction",
        
        description: "An overview of the classic multi-armed bandit problem and its three main variants - stochastic, adversarial, and Bayesian bandits, with a brief look at contextual extensions",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/MABIntro/";
          
        },
      },{id: "post-sumo-simulation-with-ray-tracing",
        
          title: "SUMO Simulation with Ray Tracing",
        
        description: "A comprehensive tutorial on creating vehicular networks with SUMO and MATLAB ray tracing",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/sumoRT/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-first-international-conference-amp-award-in-singapore",
          title: '🏆 First International Conference &amp;amp; Award in Singapore!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/20250701VTC2024/";
            },},{id: "news-my-first-poster-session",
          title: '🎓 My First Poster Session!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-09-08CIV/";
            },},{id: "news-my-personal-logo-is-born",
          title: '🐈 My Personal Logo is Born!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-10-20-logo/";
            },},{id: "news-1st-tupuhack-an-ai-agent-adventure",
          title: '🚀 1st TuPuHack, an AI Agent Adventure',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-11-23Tupuhack/";
            },},{id: "news-my-ehime-internship-is-now-on-youtube",
          title: '🍊 My Ehime Internship is Now on YouTube!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2026-03-13Vedio/";
            },},{id: "news-️-student-volunteer-at-infocom-2026",
          title: '🎙️ Student Volunteer at INFOCOM 2026!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2026-5-20-INFOCOM2026/";
            },},{id: "news-presented-at-ieee-vnc-2026-in-montreal",
          title: '🎤 Presented at IEEE VNC 2026 in Montreal!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2026-06-11VNC2026/";
            },},{id: "projects-wisj-ml-summer-school",
          title: 'WISJ ML Summer School',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/WISJ_Leisure/";
            },},{id: "projects-multi-armed-bandits-for-v2x-user-association",
          title: 'Multi-Armed Bandits for V2X User Association',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/mab_v2x/";
            },},{id: "projects-orange-hunt",
          title: 'Orange Hunt',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/mikan_intern/";
            },},{id: "projects-vehicular-network-simulation-with-sumo-and-ray-tracing",
          title: 'Vehicular Network Simulation with SUMO and Ray Tracing',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sumo_raytracing/";
            },},{id: "projects-bringing-your-own-simulator-to-veins",
          title: 'Bringing Your Own Simulator to Veins',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/veins_cosim/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%77%65%69%71%69%63%68%69@%67.%65%63%63.%75-%74%6F%6B%79%6F.%61%63.%6A%70", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Chiqq3", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0007-2851-1581", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Weiqi-Chi/", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://chiqq3.github.io/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
