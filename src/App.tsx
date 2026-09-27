import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import "./App.css";

type Option = {
  label: string;
  emoji: string;
};

type Destination = {
  name: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
  foods: string[];
  places: string[];
  experiences: string[];
};

type Answers = {
  vibes: string[];
  companion: string;
  duration: string;
  budget: string;
  customBudget: string;
  foods: string[];
  experiences: string[];
  travelStyle: string;
};

type SavedTrip = {
  id: string;
  title: string;
  destination: string;
  trip_data: {
    destination: Destination;
    answers: Answers;
  };
  created_at: string;
};

const questions = [
  {
    title: "What kind of trip are you craving?",
    subtitle: "Choose the vibes that feel like you.",
    type: "multiple",
    key: "vibes",
    options: [
      { label: "Peaceful", emoji: "🌿" },
      { label: "Adventure", emoji: "🏔️" },
      { label: "Romantic", emoji: "❤️" },
      { label: "Fun & Social", emoji: "🎉" },
      { label: "Photography", emoji: "📸" },
      { label: "Beach Escape", emoji: "🌊" },
      { label: "Nature", emoji: "🌲" },
      { label: "City Explorer", emoji: "🏙️" },
    ],
  },
  {
    title: "Who are you travelling with?",
    subtitle: "Every trip has its own kind of company.",
    type: "single",
    key: "companion",
    options: [
      { label: "Solo", emoji: "🧍" },
      { label: "Friends", emoji: "👯" },
      { label: "Couple", emoji: "❤️" },
      { label: "Family", emoji: "👨‍👩‍👧" },
    ],
  },
  {
    title: "How much time do you have?",
    subtitle: "We'll shape the trip around your time.",
    type: "single",
    key: "duration",
    options: [
      { label: "2 Days", emoji: "🌤️" },
      { label: "3 Days", emoji: "🌅" },
      { label: "4 Days", emoji: "🗺️" },
      { label: "5 Days", emoji: "🚗" },
      { label: "1 Week+", emoji: "✈️" },
    ],
  },
  {
    title: "What's your trip budget?",
    subtitle: "Approximate total trip budget.",
    type: "single",
    key: "budget",
    options: [
      { label: "₹5,000", emoji: "💰" },
      { label: "₹10,000", emoji: "💵" },
      { label: "₹15,000", emoji: "💳" },
      { label: "₹25,000", emoji: "✨" },
      { label: "₹50,000+", emoji: "🌟" },
    ],
  },
  {
    title: "What do you actually love to eat?",
    subtitle: "Your food preferences shape your trip.",
    type: "multiple",
    key: "foods",
    options: [
      { label: "South Indian", emoji: "🍛" },
      { label: "Spicy Food", emoji: "🌶️" },
      { label: "Asian", emoji: "🍜" },
      { label: "Fast Food", emoji: "🍕" },
      { label: "Street Food", emoji: "🌮" },
      { label: "Cafés & Desserts", emoji: "☕" },
      { label: "Local Cuisine", emoji: "🍲" },
      { label: "Healthy Food", emoji: "🥗" },
    ],
  },
  {
    title: "What do you want to experience?",
    subtitle: "Pick the moments you want to remember.",
    type: "multiple",
    key: "experiences",
    options: [
      { label: "Photography", emoji: "📸" },
      { label: "Sunsets", emoji: "🌅" },
      { label: "Nature", emoji: "🌲" },
      { label: "Adventure", emoji: "🥾" },
      { label: "Culture", emoji: "🏛️" },
      { label: "Food", emoji: "🍜" },
      { label: "Shopping", emoji: "🛍️" },
      { label: "Nightlife", emoji: "🎶" },
      { label: "Relaxation", emoji: "🧘" },
    ],
  },
  {
    title: "How do you like to travel?",
    subtitle: "There's no wrong way to explore.",
    type: "single",
    key: "travelStyle",
    options: [
      { label: "Slow & Relaxed", emoji: "🌿" },
      { label: "Balanced", emoji: "⚖️" },
      { label: "Packed With Experiences", emoji: "⚡" },
      { label: "Luxury", emoji: "✨" },
      { label: "Budget Friendly", emoji: "💰" },
    ],
  },
];

const destinations: Destination[] = [
  {
    name: "Coorg",
    location: "Karnataka, India",
    description:
      "A peaceful escape through coffee plantations, misty hills, waterfalls and slow mornings.",
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1400&q=85",
    tags: ["Nature", "Photography", "Peaceful"],
    foods: [
      "Local Coorgi cuisine",
      "South Indian breakfast",
      "Coffee and homemade desserts",
      "Fresh local meals",
    ],
    places: [
      "Abbey Falls",
      "Raja's Seat",
      "Mandalpatti viewpoint",
      "Coffee plantations",
    ],
    experiences: [
      "Walk through coffee plantations",
      "Watch the sunset from a viewpoint",
      "Explore waterfalls",
      "Enjoy a slow café morning",
    ],
  },
  {
    name: "Munnar",
    location: "Kerala, India",
    description:
      "Rolling tea gardens, cool mountain air and scenic roads made for a refreshing escape.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    tags: ["Nature", "Mountains", "Relaxation"],
    foods: [
      "Kerala meals",
      "Appam and stew",
      "South Indian breakfast",
      "Tea and local snacks",
    ],
    places: [
      "Tea gardens",
      "Mattupetty Dam",
      "Top Station",
      "Eravikulam National Park",
    ],
    experiences: [
      "Explore tea plantations",
      "Capture misty mountain views",
      "Enjoy a scenic drive",
      "Relax with a cup of tea",
    ],
  },
  {
    name: "Goa",
    location: "Goa, India",
    description:
      "Golden beaches, colourful streets, relaxed cafés and beautiful coastal sunsets.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
    tags: ["Beach", "Sunsets", "Fun"],
    foods: [
      "Goan local cuisine",
      "South Indian food",
      "Beachside snacks",
      "Cafés and desserts",
    ],
    places: [
      "Baga Beach",
      "Fort Aguada",
      "Fontainhas",
      "Chapora Fort",
    ],
    experiences: [
      "Watch a beach sunset",
      "Explore colourful streets",
      "Try local food",
      "Spend a relaxed evening by the sea",
    ],
  },
  {
    name: "Udaipur",
    location: "Rajasthan, India",
    description:
      "Lakeside views, royal architecture, beautiful old streets and memorable sunsets.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=85",
    tags: ["Culture", "Photography", "Romantic"],
    foods: [
      "Rajasthani thali",
      "Local street food",
      "South Indian options",
      "Cafés and desserts",
    ],
    places: [
      "Lake Pichola",
      "City Palace",
      "Fateh Sagar Lake",
      "Bagore Ki Haveli",
    ],
    experiences: [
      "Take a lakeside walk",
      "Explore historic architecture",
      "Watch the sunset by the lake",
      "Discover local food",
    ],
  },
  {
    name: "Manali",
    location: "Himachal Pradesh, India",
    description:
      "Mountain scenery, pine forests, river views and adventurous days in the Himalayas.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
    tags: ["Mountains", "Adventure", "Nature"],
    foods: [
      "Himachali local food",
      "North Indian meals",
      "Cafés and desserts",
      "Warm local snacks",
    ],
    places: [
      "Solang Valley",
      "Old Manali",
      "Hadimba Temple",
      "Vashisht",
    ],
    experiences: [
      "Explore mountain trails",
      "Visit scenic viewpoints",
      "Discover Old Manali",
      "Enjoy a cosy café",
    ],
  },
  {
    name: "Jaipur",
    location: "Rajasthan, India",
    description:
      "Pink-hued streets, grand forts, colourful markets and a rich local food scene.",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1400&q=85",
    tags: ["Culture", "City", "Food"],
    foods: [
      "Rajasthani thali",
      "Local street food",
      "South Indian food",
      "Traditional sweets",
    ],
    places: [
      "Hawa Mahal",
      "Amber Fort",
      "City Palace",
      "Johari Bazaar",
    ],
    experiences: [
      "Explore historic forts",
      "Try local street food",
      "Shop in colourful markets",
      "Capture heritage architecture",
    ],
  },
  {
    name: "Gokarna",
    location: "Karnataka, India",
    description:
      "Quiet beaches, coastal trails and laid-back days away from the crowds.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85",
    tags: ["Beach", "Peaceful", "Sunsets"],
    foods: [
      "South Indian meals",
      "Local coastal cuisine",
      "Beachside snacks",
      "Cafés and desserts",
    ],
    places: [
      "Om Beach",
      "Kudle Beach",
      "Half Moon Beach",
      "Mahabaleshwar Temple",
    ],
    experiences: [
      "Walk along the coast",
      "Watch the sunset",
      "Explore beach trails",
      "Enjoy a relaxed café stop",
    ],
  },
  {
    name: "Hyderabad",
    location: "Telangana, India",
    description:
      "Historic landmarks, lively markets, city experiences and a memorable food culture.",
    image:
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1400&q=85",
    tags: ["City", "Culture", "Food"],
    foods: [
      "South Indian food",
      "Local Hyderabadi cuisine",
      "Street food",
      "Cafés and desserts",
    ],
    places: [
      "Charminar",
      "Golconda Fort",
      "Hussain Sagar",
      "Laad Bazaar",
    ],
    experiences: [
      "Explore historic landmarks",
      "Discover local food",
      "Shop in traditional markets",
      "Enjoy a city evening",
    ],
  },
];

const initialAnswers: Answers = {
  vibes: [],
  companion: "",
  duration: "",
  budget: "",
  customBudget: "",
  foods: [],
  experiences: [],
  travelStyle: "",
};

const formatBudget = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Not specified";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

function getBudgetAmount(answers: Answers): number {
  if (answers.customBudget.trim()) {
    return Number(answers.customBudget);
  }

  if (answers.budget === "₹50,000+") return 50000;

  return Number(answers.budget.replace(/[₹,]/g, "")) || 15000;
}

function getDestination(answers: Answers): Destination {
  const preferences = [
    ...answers.vibes,
    ...answers.foods,
    ...answers.experiences,
    answers.travelStyle,
  ]
    .join(" ")
    .toLowerCase();

  if (
    preferences.includes("beach") ||
    preferences.includes("sunset")
  ) {
    return answers.vibes.includes("Beach Escape")
      ? destinations[6]
      : destinations[2];
  }

  if (
    preferences.includes("adventure") ||
    preferences.includes("mountain")
  ) {
    return destinations[4];
  }

  if (
    preferences.includes("culture") ||
    preferences.includes("shopping") ||
    preferences.includes("city")
  ) {
    return answers.foods.includes("Street Food")
      ? destinations[5]
      : destinations[3];
  }

  if (
    answers.foods.includes("South Indian") ||
    answers.foods.includes("Spicy Food")
  ) {
    return destinations[7];
  }

  if (
    answers.vibes.includes("Peaceful") ||
    answers.vibes.includes("Nature") ||
    answers.travelStyle === "Slow & Relaxed"
  ) {
    return destinations[0];
  }

  return destinations[1];
}

function getTripDays(duration: string): number {
  if (duration === "2 Days") return 2;
  if (duration === "3 Days") return 3;
  if (duration === "4 Days") return 4;
  if (duration === "5 Days") return 5;
  return 7;
}

function getPersonalReason(answers: Answers, destination: Destination) {
  const reasons: string[] = [];

  if (answers.vibes.length > 0) {
    reasons.push(`your ${answers.vibes.join(", ").toLowerCase()} vibe`);
  }

  if (answers.foods.length > 0) {
    reasons.push(`your love for ${answers.foods.join(", ").toLowerCase()}`);
  }

  if (answers.experiences.length > 0) {
    reasons.push(
      `the experiences you selected: ${answers.experiences.join(", ").toLowerCase()}`
    );
  }

  if (reasons.length === 0) {
    return `${destination.name} offers a mix of memorable places, local food and experiences.`;
  }

  return `${destination.name} matches ${reasons.join(" and ")}. We have shaped the suggestions around your travel time, budget and preferences.`;
}

function getFoodRecommendations(
  answers: Answers,
  destination: Destination
): string[] {
  const recommendations: string[] = [];

  if (answers.foods.includes("South Indian")) {
    recommendations.push("South Indian breakfast");
  }

  if (answers.foods.includes("Spicy Food")) {
    recommendations.push("Local spicy specialities");
  }

  if (answers.foods.includes("Street Food")) {
    recommendations.push("Local street-food favourites");
  }

  if (answers.foods.includes("Fast Food")) {
    recommendations.push("Pizza, burgers and quick bites");
  }

  if (answers.foods.includes("Asian")) {
    recommendations.push("Asian-inspired meals");
  }

  if (answers.foods.includes("Cafés & Desserts")) {
    recommendations.push("A cosy café and dessert stop");
  }

  if (answers.foods.includes("Healthy Food")) {
    recommendations.push("Fresh, lighter meal options");
  }

  if (answers.foods.includes("Local Cuisine")) {
    recommendations.push("Regional local cuisine");
  }

  if (recommendations.length === 0) {
    return destination.foods.slice(0, 3);
  }

  return [...recommendations, ...destination.foods].slice(0, 5);
}

function App() {
  const [page, setPage] = useState<
  "home" | "planner" | "results" | "auth" | "trips"
>("home");
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [destination, setDestination] = useState<Destination>(destinations[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [error, setError] = useState("");

const [saved, setSaved] = useState(false);

const [menuOpen, setMenuOpen] = useState(false);

// Supabase user
const [user, setUser] = useState<User | null>(null);

// Login and signup
const [authMode, setAuthMode] = useState<"login" | "signup">("login");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authBusy, setAuthBusy] = useState(false);
const [authError, setAuthError] = useState("");
const [authMessage, setAuthMessage] = useState("");

const [authReturnPage, setAuthReturnPage] = useState<
  "home" | "results" | "trips"
>("home");

// Saved trips
const [trips, setTrips] = useState<SavedTrip[]>([]);
const [tripsLoading, setTripsLoading] = useState(false);
const [tripsError, setTripsError] = useState("");

const loadingMessages = [
  "Reading your vibe...",
  "Understanding your travel style...",
  "Matching destinations...",
  "Finding experiences...",
  "Matching your food preferences...",
  "Planning the perfect timing...",
  "Building your itinerary...",
  "Your trip is ready!",
];

  useEffect(() => {
    if (!isLoading) return;

    setLoadingMessage(0);

    const interval = window.setInterval(() => {
      setLoadingMessage((current) => {
        if (current >= loadingMessages.length - 1) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 550);

    const timeout = window.setTimeout(() => {
      setDestination(getDestination(answers));
      setIsLoading(false);
      setPage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 4400);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [isLoading, answers]);

  const startPlanner = () => {
    setPage("planner");
    setStep(0);
    setError("");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setPage("home");
    setIsLoading(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateAnswer = (
    key: keyof Answers,
    value: string | string[]
  ) => {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
    setError("");
  };

  const toggleMultiOption = (
    key: "vibes" | "foods" | "experiences",
    value: string
  ) => {
    const currentValues = answers[key];

    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateAnswer(key, nextValues);
  };

  const isStepValid = () => {
    const question = questions[step];
    const key = question.key as keyof Answers;

    if (key === "vibes" || key === "foods" || key === "experiences") {
      return answers[key].length > 0;
    }

    if (key === "budget") {
      if (answers.customBudget.trim()) {
        const amount = Number(answers.customBudget);
        return Number.isFinite(amount) && amount > 0;
      }

      return answers.budget !== "";
    }

    return Boolean(answers[key]);
  };

  const nextStep = () => {
    if (!isStepValid()) {
      setError(
        step === 3
          ? "Choose a budget or enter a valid custom budget."
          : "Please select an option to continue."
      );
      return;
    }

    setError("");

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
    } else {
      setIsLoading(true);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((current) => current - 1);
      setError("");
    } else {
      goHome();
    }
  };

  const openAuth = (
  returnTo: "home" | "results" | "trips" = "home"
) => {
  setAuthReturnPage(returnTo);
  setAuthMode("login");
  setAuthError("");
  setAuthMessage("");
  setAuthPassword("");
  setPage("auth");
  setMenuOpen(false);
};

const loadTrips = async (userId: string) => {
  setTripsLoading(true);
  setTripsError("");

  const { data, error } = await supabase
    .from("trips")
    .select("id, title, destination, trip_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    setTripsError(error.message);
    setTrips([]);
  } else {
    setTrips((data ?? []) as unknown as SavedTrip[]);
  }

  setTripsLoading(false);
};

  const saveTrip = async () => {
  setError("");

  // 1. Check whether the user is logged in
  const {
    data: { user: currentUser },
    error: authCheckError,
  } = await supabase.auth.getUser();

  if (authCheckError || !currentUser) {
    setError("Please log in before saving your trip.");
    openAuth("results");
    return;
  }

  // 2. Save the trip to Supabase
  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: currentUser.id,
      title: `${destination.name} getaway`,
      destination: destination.name,
      trip_data: {
        destination,
        answers,
      },
    })
    .select()
    .single();

  // 3. Show an error if saving fails
  if (error) {
    console.error("Supabase save error:", error);
    setError(`Unable to save trip: ${error.message}`);
    return;
  }

  // 4. Update the app after saving successfully
  console.log("Trip saved successfully:", data);

  setSaved(true);
  await loadTrips(currentUser.id);
};

const openTrips = async () => {
  setMenuOpen(false);

  if (!user) {
    openAuth("trips");
    return;
  }

  setPage("trips");
  window.scrollTo({ top: 0, behavior: "smooth" });

  await loadTrips(user.id);
};

  const shareTrip = async () => {
    const text = `My Vibe & Bite trip: ${destination.name}, ${destination.location}. ${destination.description}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `My trip to ${destination.name}`,
          text,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("Trip details copied!");
      } else {
        window.prompt("Copy your trip details:", text);
      }
    } catch {
      // The user may close the share dialog; no action is needed.
    }
  };

  const startOver = () => {
    setAnswers(initialAnswers);
    setStep(0);
    setSaved(false);
    setError("");
    setPage("planner");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tripDays = getTripDays(answers.duration);
  const budgetAmount = getBudgetAmount(answers);
  const estimatedDailyBudget = Math.round(budgetAmount / tripDays);
  const foodRecommendations = getFoodRecommendations(answers, destination);

  const itinerary = Array.from({ length: tripDays }, (_, index) => ({
    day: index + 1,
    title: [
      "Arrive & explore",
      "Discover the highlights",
      "Local experiences",
      "A day at your own pace",
      "Explore a little more",
      "Make room for surprises",
      "A relaxed goodbye",
    ][index % 7],
    place: destination.places[index % destination.places.length],
    experience:
      destination.experiences[index % destination.experiences.length],
    food: foodRecommendations[index % foodRecommendations.length],
  }));
  // Handle login and signup
  const handleAuthSubmit = async () => {
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        // Supabase may require email confirmation
        if (!data.session) {
          setAuthMessage(
            "Account created! Please check your email to confirm your account."
          );
          return;
        }

        setUser(data.user);
        setAuthPassword("");
        setPage(authReturnPage);
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });

        if (error) {
          setAuthError(error.message);
          return;
        }

        setUser(data.user);
        setAuthPassword("");
        setPage(authReturnPage);
      }
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setAuthBusy(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
      return;
    }

    setUser(null);
    setPage("home");
    setAuthEmail("");
    setAuthPassword("");
    setSaved(false);
  };

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={goHome} aria-label="Vibe and Bite home">
          <span className="brand-icon">✦</span>
          <span>
            Vibe <span className="brand-amp">&</span> Bite
          </span>
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <button className="text-btn" onClick={goHome}>
            Discover
          </button>
          <button
            className="text-btn"
            onClick={() => {
              goHome();
              window.setTimeout(() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            How It Works
          </button>
          <button
  className="text-btn"
  onClick={openTrips}
>
  My Trips
</button>
          <button className="nav-cta" onClick={startPlanner}>
            Plan My Trip <span>✦</span>
          </button>
        </nav>
      </header>

      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">YOUR PERSONAL TRAVEL COMPANION</span>

              <h1>
                You bring the vibe.
                <br />
                <span>We decide the trip.</span>
              </h1>

              <p>
                Stop scrolling through endless destinations, restaurants and
                itineraries. Tell us what you want, and Vibe & Bite creates a
                trip that actually feels like you.
              </p>

              <div className="hero-actions">
                <button className="primary-btn" onClick={startPlanner}>
                  Plan My Trip <span>✦</span>
                </button>
                <button
                  className="secondary-btn"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See How It Works
                </button>
              </div>

              <div className="hero-trust">
                <span>✓ Personalized</span>
                <span>✓ Simple</span>
                <span>✓ Experience-first</span>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                className="hero-image"
                src={destinations[0].image}
                alt="Beautiful green travel landscape"
              />
              <div className="floating-card">
                <span className="floating-card-icon">✦</span>
                <div>
                  <strong>Your next trip, decided.</strong>
                  <p>Made around you.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="intro-section">
            <span className="eyebrow">LESS PLANNING, MORE LIVING</span>
            <h2>Travel shouldn't feel like homework.</h2>
            <p>
              Too many tabs. Too many reviews. Too many decisions. Tell us what
              matters to you, and let your next trip come together.
            </p>

            <div className="intro-stats">
              <div>
                <strong>50</strong>
                <span>destination searches</span>
              </div>
              <div>
                <strong>20</strong>
                <span>restaurant tabs</span>
              </div>
              <div>
                <strong>1</strong>
                <span>personalized direction</span>
              </div>
            </div>

            <h3>Less searching <span>→</span> More experiencing</h3>
          </section>

          <section className="how-section" id="how-it-works">
            <div className="section-heading">
              <span className="eyebrow">FOUR SIMPLE STEPS</span>
              <h2>From “where should I go?” to “let's go.”</h2>
              <p className="section-description">
                Your preferences in. A trip that feels like you, out.
              </p>
            </div>

            <div className="steps-grid">
              {[
                {
                  number: "01",
                  title: "Tell Us Your Vibe",
                  description:
                    "Share your mood, budget, time, food preferences and interests.",
                  emoji: "💭",
                },
                {
                  number: "02",
                  title: "We Understand You",
                  description:
                    "Your answers become a personal travel profile.",
                  emoji: "🧩",
                },
                {
                  number: "03",
                  title: "We Make the Decisions",
                  description:
                    "Get a destination, food ideas, places and an itinerary.",
                  emoji: "🗺️",
                },
                {
                  number: "04",
                  title: "Just Go",
                  description:
                    "Take your plan with you and focus on the experience.",
                  emoji: "✈️",
                },
              ].map((item) => (
                <article className="step-card" key={item.number}>
                  <span className="step-number">{item.number}</span>
                  <span className="step-emoji">{item.emoji}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="destination-section">
            <div className="section-heading">
              <span className="eyebrow">A LITTLE INSPIRATION</span>
              <h2>Somewhere wonderful is waiting.</h2>
              <p className="section-description">
                Your answers help us choose a destination that suits your trip.
              </p>
            </div>

            <div className="destination-grid">
              {destinations.slice(0, 3).map((place) => (
                <article className="destination-card" key={place.name}>
                  <div className="destination-image-wrap">
                    <img src={place.image} alt={place.name} />
                  </div>
                  <div className="destination-card-content">
                    <span className="destination-location">
                      {place.location}
                    </span>
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>Stop searching. Start experiencing.</h2>
            <p>Your next trip shouldn't take 20 tabs to plan.</p>
            <button className="primary-btn" onClick={startPlanner}>
              Decide My Trip <span>✦</span>
            </button>
          </section>
        </main>
      )}

      {page === "planner" && !isLoading && (
        <main className="planner-section">
          <div className="planner-top">
            <button className="back-btn" onClick={previousStep}>
              ← Back
            </button>
            <span className="step-count">
              {String(step + 1).padStart(2, "0")} / 07
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          <section className="question-content" key={step}>
            <span className="eyebrow">LET'S PLAN YOUR ESCAPE</span>
            <h1>{questions[step].title}</h1>
            <p>{questions[step].subtitle}</p>

            <div className="options-grid">
              {questions[step].options.map((option: Option) => {
                const questionKey = questions[step].key as keyof Answers;
                const isMulti =
                  questionKey === "vibes" ||
                  questionKey === "foods" ||
                  questionKey === "experiences";

                const selected = isMulti
                  ? (answers[questionKey] as string[]).includes(option.label)
                  : answers[questionKey] === option.label;

                return (
                  <button
                    type="button"
                    key={option.label}
                    className={`option-card ${selected ? "selected" : ""}`}
                    onClick={() => {
                      if (isMulti) {
                        toggleMultiOption(
                          questionKey as "vibes" | "foods" | "experiences",
                          option.label
                        );
                      } else {
                        updateAnswer(questionKey, option.label);
                      }
                    }}
                    aria-pressed={selected}
                  >
                    <span className="option-emoji">{option.emoji}</span>
                    <span>{option.label}</span>
                    <span className="option-check">
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            {step === 3 && (
              <div className="custom-budget">
                <label htmlFor="custom-budget-input">
                  Or enter your own budget
                </label>
                <div className="budget-input-wrap">
                  <span>₹</span>
                  <input
                    id="custom-budget-input"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={answers.customBudget}
                    onChange={(event) => {
                      updateAnswer("customBudget", event.target.value);
                      if (event.target.value) {
                        updateAnswer("budget", "");
                      }
                    }}
                  />
                </div>
                <small>Approximate total trip budget.</small>
              </div>
            )}

            {step === 3 && (
              <div className="custom-budget">
                <label htmlFor="trip-notes">
                  Or just tell us what you want (optional)
                </label>
                <textarea
                  id="trip-notes"
                  rows={3}
                  placeholder="I have ₹15,000, 4 days and I'm travelling with two friends. I love photography, peaceful places and South Indian food."
                  onChange={(event) => {
                    const text = event.target.value.toLowerCase();

                    if (text.includes("south indian")) {
                      setAnswers((current) => ({
                        ...current,
                        foods: current.foods.includes("South Indian")
                          ? current.foods
                          : [...current.foods, "South Indian"],
                      }));
                    }

                    if (text.includes("photography")) {
                      setAnswers((current) => ({
                        ...current,
                        experiences: current.experiences.includes("Photography")
                          ? current.experiences
                          : [...current.experiences, "Photography"],
                      }));
                    }

                    if (text.includes("peaceful")) {
                      setAnswers((current) => ({
                        ...current,
                        vibes: current.vibes.includes("Peaceful")
                          ? current.vibes
                          : [...current.vibes, "Peaceful"],
                      }));
                    }
                  }}
                />
              </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <p className="selection-hint">
              {step === 0 || step === 4 || step === 5
                ? "Select all that apply."
                : "Choose one option to continue."}
            </p>

            <div className="planner-actions">
              <button className="back-btn" onClick={previousStep}>
                Back
              </button>
              <button className="primary-btn" onClick={nextStep}>
                {step === questions.length - 1
                  ? "Decide My Trip ✨"
                  : "Continue →"}
              </button>
            </div>
          </section>
        </main>
      )}

      {isLoading && (
        <main className="loading-section">
          <div className="loading-orbit">
            <span>✦</span>
          </div>
          <span className="eyebrow">VIBE & BITE</span>
          <h1>Putting your trip together...</h1>
          <p>{loadingMessages[loadingMessage]}</p>
          <div className="loading-track">
            <div
              className="loading-fill"
              style={{
                width: `${((loadingMessage + 1) / loadingMessages.length) * 100}%`,
              }}
            />
          </div>
        </main>
      )}

      {page === "results" && !isLoading && (
        <main className="results-section">
          <div className="results-heading">
            <span className="eyebrow">YOUR PERSONALIZED GETAWAY</span>
            <h1>Your trip is decided.</h1>
            <p>We found something that feels like you.</p>
          </div>

          <section className="result-hero">
            <img
              className="result-hero-image"
              src={destination.image}
              alt={destination.name}
            />
            <div className="result-hero-content">
              <span className="eyebrow">{destination.location}</span>
              <h2>{destination.name}</h2>
              <p>{destination.description}</p>

              <div className="result-tags">
                {destination.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="result-block">
            <div className="section-heading">
              <span className="eyebrow">MADE AROUND YOU</span>
              <h2>Why we chose this</h2>
            </div>
            <div className="profile-card">
              <span className="profile-icon">✦</span>
              <p>{getPersonalReason(answers, destination)}</p>
              <div className="highlight-list">
                <span>✦ {answers.duration || "Flexible"} trip</span>
                <span>✦ {answers.companion || "Your own"} travel style</span>
                <span>✦ {answers.travelStyle || "Personalized"} pace</span>
              </div>
            </div>
          </section>

          <section className="result-block">
            <div className="section-heading">
              <span className="eyebrow">YOUR TRAVEL SNAPSHOT</span>
              <h2>A trip that fits your vibe.</h2>
            </div>
            <div className="profile-grid">
              <article className="profile-card">
                <span className="profile-card-icon">🧭</span>
                <h3>Your vibe</h3>
                <p>{answers.vibes.join(", ") || "Open to discovery"}</p>
              </article>
              <article className="profile-card">
                <span className="profile-card-icon">👥</span>
                <h3>Travelling with</h3>
                <p>{answers.companion || "Not specified"}</p>
              </article>
              <article className="profile-card">
                <span className="profile-card-icon">📅</span>
                <h3>Time</h3>
                <p>{answers.duration || "Flexible"}</p>
              </article>
              <article className="profile-card">
                <span className="profile-card-icon">💰</span>
                <h3>Trip budget</h3>
                <p>
                  {answers.customBudget
                    ? formatBudget(answers.customBudget)
                    : answers.budget || "Not specified"}
                </p>
              </article>
            </div>
            <p className="match-disclaimer">
              Budget is your approximate total trip budget. Actual costs vary
              by transport, stay, season and personal choices.
            </p>
          </section>

          <section className="result-block">
            <div className="section-heading">
              <span className="eyebrow">PLACES TO EXPLORE</span>
              <h2>Your destination, your way.</h2>
              <p className="section-description">
                A short list of places to help you make the most of your trip.
              </p>
            </div>
            <div className="places-grid">
              {destination.places.map((place, index) => (
                <article className="place-card" key={place}>
                  <span className="food-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="place-card-content">
                    <h3>{place}</h3>
                    <p>
                      {index === 0
                        ? "A highlight to start your trip."
                        : index === 1
                          ? "Add this to your exploration day."
                          : "A lovely stop to include if time allows."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="result-block">
            <div className="section-heading">
              <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
              <h2>Food picks for you.</h2>
              <p className="section-description">
                Suggestions shaped by the food preferences you selected.
              </p>
            </div>
            <div className="food-grid">
              {foodRecommendations.map((food, index) => (
                <article className="food-card" key={`${food}-${index}`}>
                  <div className="food-image">
                    <span>{["🍛", "🌶️", "🍜", "☕", "🥗"][index % 5]}</span>
                  </div>
                  <div className="food-card-content">
                    <span className="food-number">
                      PICK {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{food}</h3>
                    <p>Look for a well-reviewed local option nearby.</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="match-disclaimer">
              These are food ideas, not verified restaurant bookings. Check
              current menus, opening hours and reviews before visiting.
            </p>
          </section>

          <section className="result-block">
            <div className="section-heading">
              <span className="eyebrow">MAKE IT A MEMORY</span>
              <h2>Experiences to look forward to.</h2>
            </div>
            <div className="experience-grid">
              {destination.experiences.map((experience, index) => (
                <article className="experience-card" key={experience}>
                  <span className="experience-emoji">
                    {["📸", "🌅", "🌿", "✨"][index % 4]}
                  </span>
                  <h3>{experience}</h3>
                  <p>
                    {answers.experiences.length > 0
                      ? `Inspired by your interest in ${answers.experiences[index % answers.experiences.length].toLowerCase()}.`
                      : "A memorable way to experience the destination."}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="result-block itinerary-section">
            <div className="section-heading">
              <span className="eyebrow">YOUR TRIP, DAY BY DAY</span>
              <h2>A simple itinerary.</h2>
              <p className="section-description">
                A flexible outline. Adjust it to your travel dates and opening
                times.
              </p>
            </div>

            <div className="itinerary-list">
              {itinerary.map((item) => (
                <article className="itinerary-item" key={item.day}>
                  <div className="itinerary-day">
                    <span>DAY</span>
                    <strong>{String(item.day).padStart(2, "0")}</strong>
                  </div>
                  <div className="itinerary-item-content">
                    <h3>{item.title}</h3>
                    <p>
                      Visit <strong>{item.place}</strong>, then enjoy{" "}
                      {item.experience.toLowerCase()}.
                    </p>
                    <span className="itinerary-food">
                      🍽️ Food idea: {item.food}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="result-block budget-block">
            <div className="section-heading">
              <span className="eyebrow">PLAN WITH A LITTLE CLARITY</span>
              <h2>Your budget snapshot.</h2>
            </div>
            <div className="result-budget">
              <div>
                <span>Approximate total budget</span>
                <strong>{formatBudget(String(budgetAmount))}</strong>
              </div>
              <div>
                <span>Approximate daily budget</span>
                <strong>{formatBudget(String(estimatedDailyBudget))}</strong>
              </div>
              <p>
                This is a simple planning estimate, not a live quote. Keep
                transport, accommodation, meals and activities in mind.
              </p>
            </div>
          </section>

          <section className="results-cta">
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>Stop searching. Start experiencing.</h2>
            <p>Your next trip is waiting for you.</p>

            <div className="results-buttons">
              <button className="primary-btn" onClick={saveTrip}>
                {saved ? "✓ Trip Saved" : "Save My Trip"}
              </button>
              <button className="secondary-btn" onClick={shareTrip}>
                Share Trip ↗
              </button>
              <button className="back-btn" onClick={startOver}>
                Modify My Trip
              </button>
              <button className="text-btn" onClick={goHome}>
                Back to Home
              </button>
            </div>

            {saved && (
              <p className="success-message">
                Your trip has been saved in this browser.
              </p>
            )}
            {error && <p className="error-message">{error}</p>}
          </section>
        </main>
      )}
      {/* LOGIN / SIGNUP PAGE */}
      {page === "auth" && (
        <main className="planner-section">
          <section className="question-content">
            <span className="eyebrow">WELCOME TO VIBE & BITE</span>

            <h1>
              {authMode === "login" ? "Welcome back!" : "Create your account"}
            </h1>

            <p>
              {authMode === "login"
                ? "Log in to save your personalized trips."
                : "Sign up to keep your trips safe in your account."}
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleAuthSubmit();
              }}
            >
              <div className="custom-budget">
                <label htmlFor="auth-email">Email address</label>
                <input
                  id="auth-email"
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
              </div>

              <div className="custom-budget">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {authError && (
                <p className="error-message">{authError}</p>
              )}

              {authMessage && (
                <p className="success-message">{authMessage}</p>
              )}

              <button
                className="primary-btn"
                type="submit"
                disabled={authBusy}
              >
                {authBusy
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Log In"
                    : "Sign Up"}
              </button>
            </form>

            <p>
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              className="secondary-btn"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError("");
                setAuthMessage("");
              }}
            >
              {authMode === "login"
                ? "Create an account"
                : "Log in instead"}
            </button>

            <button
              className="text-btn"
              onClick={() => setPage(authReturnPage)}
            >
              ← Back
            </button>
          </section>
        </main>
      )}

      {/* MY TRIPS PAGE */}
      {page === "trips" && (
        <main className="planner-section">
          <section className="question-content">
            <span className="eyebrow">YOUR TRAVEL COLLECTION</span>
            <h1>My Trips ✨</h1>
            <p>Your saved Vibe & Bite getaways.</p>

            {tripsLoading && <p>Loading your trips...</p>}

            {tripsError && (
              <p className="error-message">{tripsError}</p>
            )}

            {!tripsLoading && trips.length === 0 && (
              <p>You haven't saved any trips yet.</p>
            )}

            <div className="destination-grid">
              {trips.map((trip) => (
                <article className="destination-card" key={trip.id}>
                  <div className="destination-card-content">
                    <span className="destination-location">
                      {trip.destination}
                    </span>
                    <h3>{trip.title}</h3>
                    <p>
                      Saved on{" "}
                      {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="primary-btn"
              onClick={startPlanner}
            >
              Plan Another Trip ✦
            </button>

            <button className="secondary-btn" onClick={handleLogout}>
              Log Out
            </button>

            <button className="text-btn" onClick={goHome}>
              Back to Home
            </button>
          </section>
        </main>
      )}
      
      <footer className="footer">
        <button className="footer-brand" onClick={goHome}>
          Vibe <span>&</span> Bite
        </button>
        <p>Travel less. Experience more.</p>
        <div className="footer-links">
  <button onClick={goHome}>Discover</button>

  <button
    onClick={() =>
      document
        .getElementById("how-it-works")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    How It Works
  </button>

  <button onClick={startPlanner}>Plan My Trip</button>

  <button onClick={() => openAuth("home")}>
    Log In / Sign Up
  </button>

  <button onClick={openTrips}>
    My Trips
  </button>
</div>
      </footer>
    </div>
  );
} 

export default App;