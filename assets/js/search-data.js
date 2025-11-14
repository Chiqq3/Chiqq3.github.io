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
        },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "My project summary.",
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
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-ucb-exploration-in-sparse-rewarded-bandits",
        
          title: "UCB Exploration in Sparse Rewarded Bandits",
        
        description: "Investigating how UCB hyperparameter affects arm selection when dealing with sparse reward distributions in stochastic multi-armed bandits",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ucbTest/";
          
        },
      },{id: "post-multi-armed-bandits-a-introduction",
        
          title: "Multi-Armed Bandits: A Introduction",
        
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
            },},{id: "projects-wisj-ml-summer-school",
          title: 'WISJ ML Summer School',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/WISJ_Leisure/";
            },},{id: "projects-orange-hunt",
          title: 'Orange Hunt',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/mikan_intern/";
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
