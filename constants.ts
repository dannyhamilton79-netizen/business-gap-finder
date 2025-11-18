import type { BusinessIdea, BlogPost } from './types';

export const PRICING_DETAILS = {
  monthly: 9.99,
  foundersDiscount: 0.5,
};

export const BUDGET_OPTIONS = ['$0 – $1k', '$1k – $5k', '$5k – $20k', '$20k+'];
export const TIME_COMMITMENT_OPTIONS = ['Part-time', 'Full-time', 'Side hustle'];


export const TRENDING_IDEAS: BusinessIdea[] = [
  {
    id: '1',
    name: 'Mobile Coffee Cart',
    shortDescription: 'Serve specialty coffee and pastries in high-traffic areas.',
    longDescription: 'A mobile coffee cart offers flexibility and low overhead compared to a traditional cafe. You can target morning commuters, local events, and farmers\' markets. Focus on high-quality, locally-sourced beans and a unique menu to stand out. \n\nThis business is perfect for someone who loves coffee, enjoys interacting with people, and wants a business with a relatively low barrier to entry. Key success factors include a great location, excellent customer service, and a strong social media presence.',
    industry: 'Food & Beverage',
    targetMarket: 'Commuters, event-goers',
    startupCostEstimated: '$5k – $20k',
    roiPotential: 'Medium',
    difficulty: 'Medium',
    revenueModel: 'Direct Sales',
  },
  {
    id: '2',
    name: 'AI Automation Consulting',
    shortDescription: 'Help small businesses implement AI tools to improve efficiency.',
    longDescription: 'Many small businesses are unaware of how AI can save them time and money. As an AI Automation Consultant, you would analyze their workflows and recommend and implement AI solutions for tasks like customer service, marketing, and data analysis. \n\nThis is ideal for tech-savvy individuals with strong problem-solving skills. You can start with a small portfolio of clients and grow through referrals. The demand for these services is skyrocketing, offering high-income potential.',
    industry: 'Tech Consulting',
    targetMarket: 'Small to Medium Businesses',
    startupCostEstimated: '$0 – $1k',
    roiPotential: 'High',
    difficulty: 'Medium',
    revenueModel: 'Service Fees, Retainers',
  },
  {
    id: '3',
    name: 'Eco-Friendly Cleaning Service',
    shortDescription: 'Offer residential and commercial cleaning using sustainable products.',
    longDescription: 'With growing environmental awareness, an eco-friendly cleaning service caters to a niche but expanding market. You would use non-toxic, biodegradable products and sustainable practices. \n\nThis business appeals to environmentally conscious clients and can command premium pricing. It requires good organizational skills, reliability, and a strong marketing message focused on health and sustainability.',
    industry: 'Home Services',
    targetMarket: 'Homeowners, Offices',
    startupCostEstimated: '$1k – $5k',
    roiPotential: 'Medium',
    difficulty: 'Easy',
    revenueModel: 'Service Fees',
  },
    {
    id: '4',
    name: 'Personalized Meal Prep',
    shortDescription: 'Deliver custom, healthy meals based on dietary needs.',
    longDescription: 'Busy professionals and families often struggle to eat healthy. A personalized meal prep service solves this problem by delivering pre-portioned, ready-to-eat meals tailored to specific dietary requirements like keto, vegan, or gluten-free. \n\nSuccess in this business depends on culinary skill, understanding nutrition, and efficient logistics for sourcing ingredients and managing deliveries. It\'s a highly scalable model, starting from a home kitchen and potentially growing into a commercial operation.',
    industry: 'Health & Wellness',
    targetMarket: 'Busy professionals, Health-conscious individuals',
    startupCostEstimated: '$1k – $5k',
    roiPotential: 'Medium',
    difficulty: 'Medium',
    revenueModel: 'Subscription, A la carte',
  },
  {
    id: '5',
    name: 'Local Artisan Marketplace',
    shortDescription: 'An e-commerce platform for local artists and makers to sell their goods.',
    longDescription: 'Create a centralized online hub for your community\'s artisans. This platform would handle payments, marketing, and logistics, allowing makers to focus on their craft. You would take a commission on sales. \n\nThis business is great for someone with web development and marketing skills who is passionate about supporting local creators. It fosters community and provides a unique shopping experience that can\'t be replicated by large retailers.',
    industry: 'E-commerce',
    targetMarket: 'Local shoppers, tourists',
    startupCostEstimated: '$1k – $5k',
    roiPotential: 'Medium',
    difficulty: 'Medium',
    revenueModel: 'Commission, Listing Fees',
  },
  {
    id: '6',
    name: 'Senior Tech Support',
    shortDescription: 'Provide patient, in-home tech help for seniors.',
    longDescription: 'Many seniors struggle with modern technology. This service offers friendly, patient assistance with everything from setting up smartphones and video calling family to online safety and using social media. \n\nThis business requires excellent communication skills, patience, and a solid understanding of common consumer technology. It\'s a rewarding field with a growing demographic, and services can be charged at an hourly rate or through support packages.',
    industry: 'Personal Services',
    targetMarket: 'Seniors, their families',
    startupCostEstimated: '$0 – $1k',
    roiPotential: 'High',
    difficulty: 'Easy',
    revenueModel: 'Hourly Rate, Service Packages',
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 6,
    slug: 'why-its-worth-taking-the-leap',
    title: 'Why It’s Always Worth Taking the Leap Into Owning Your Own Business',
    author: 'Danny Hamilton',
    date: '2025-11-20',
    category: 'Entrepreneurship',
    readTime: '6 min read',
    featured: true,
    excerpt: 'Starting a business takes courage, risk, and hard work — but the rewards go far beyond money. Here’s why it’s always worth taking the leap into owning your own business.',
    body: `<h2>At some point, every entrepreneur faces the same moment — the pause before the leap.</h2>
<p>You’ve got the idea. You’ve done the math. You’ve played it out in your head a hundred times. And still, the voice of doubt whispers: “What if it doesn’t work?”</p>
<p>The truth? It might not — at least not the first time. But ask anyone who’s built something of their own, and they’ll tell you the same thing: <strong>it was still worth it.</strong></p>
<p>Because the real reward of starting your own business isn’t just success — it’s ownership. Ownership of your time, your ideas, and your growth.</p>
<h3>1️⃣ You Learn More in a Year of Business Than in a Decade of Jobs</h3>
<p>When you run your own business, the learning curve is steep — but it’s yours. You’re not just learning one skill; you’re learning ten.</p>
<p>Marketing. Sales. Operations. Customer service. Negotiation. Every mistake becomes an asset. You build experience that no classroom or job title can match.</p>
<h3>2️⃣ Freedom Comes With Accountability</h3>
<p>Freedom doesn’t mean fewer responsibilities — it means <em>choosing</em> them. When you own a business, your success depends on your actions. That’s terrifying and liberating in equal measure.</p>
<p>You’ll work harder than you ever have, but it feels different. Every hour moves <em>your</em> vision forward.</p>
<h3>3️⃣ You Build Something That Outlives Your Effort</h3>
<p>In a job, your best day ends when you clock out. In a business, your best day becomes foundation. The systems and customers you build keep creating value — even when you take a day off.</p>
<p>That’s the moment your business starts working for you — the real definition of freedom.</p>
<h3>4️⃣ There’s Never a “Perfect Time”</h3>
<p>If you wait for the stars to align — the money, the timing, the courage — you’ll wait forever. Starting a business is like jumping into cold water: you’ll never feel ready, but once you dive in, the fear disappears.</p>
<p>You can start small, start part-time, start with what you have. But start.</p>
<h3>5️⃣ The Hard Work Is the Point</h3>
<p>Owning a business isn’t easy. It’s long days, uncertainty, and hard lessons. But those challenges are what make it meaningful. You’ll feel the pride that only comes from building something real — from the ground up.</p>
<h3>6️⃣ The Rewards Go Beyond Money</h3>
<p>Entrepreneurs don’t just create income — they create opportunity. They build jobs, serve their communities, and solve problems others overlook. That sense of purpose is worth more than any paycheck.</p>
<h3>7️⃣ The Leap Is What Changes You</h3>
<p>Even if your first business doesn’t take off, <em>you</em> will. Every venture teaches you something new about resilience, creativity, and persistence. The leap is what transforms you — not the landing.</p>
<h3>Final Thought</h3>
<p>Owning your own business isn’t easy, but it’s the most rewarding kind of hard there is. You’ll work longer hours, take bigger risks, and face bigger challenges — but you’ll wake up every day building your own future, not someone else’s.</p>
<p>So if you’re standing on the edge, waiting for a sign — this is it. Take the leap. You’ll never regret betting on yourself.</p>
<div class="my-6 p-4 bg-amber-50 border-l-4 border-accent text-center">
    <p class="font-bold">Ready to take the first step?</p>
    <p>Try the free quiz at Business Gap Finder and discover the business idea that fits your goals, your budget, and your next chapter.</p>
</div>`,
    tags: ["entrepreneurship", "motivation", "small business", "mindset", "business ownership", "self-growth"],
    related: ["the-100-startup-challenge", "from-idea-to-income"],
    views: 0,
  },
  {
    id: 4,
    slug: 'the-100-startup-challenge',
    title: 'The $100 Startup Challenge: How I Turned Nothing Into a Thriving Business',
    author: 'Danny Hamilton',
    date: '2025-11-18',
    category: 'Entrepreneurship',
    readTime: '7 min read',
    featured: false,
    excerpt: 'How one entrepreneur in Victoria, BC turned $100 and an AI app into a thriving service business — from flipping furniture to cleaning bins and scaling smart.',
    body: `<h2>It started with a few things I didn’t need anymore.</h2>
<p>A spare drill. An old table. Some furniture collecting dust in the garage. I listed them online, and within days I’d made a few hundred dollars.</p>
<p>Then I realized something powerful — I didn’t need to wait for a big business idea. I could start with what I already had.</p>
<p>So I began picking up <strong>free items from Marketplace</strong> — tools, furniture, whatever looked like it had potential. I cleaned them, repaired them, refinished them, and resold them. Each item brought in at least <strong>60% ROI</strong>, sometimes more. And before long, that little flipping experiment turned into seed money for my next move.</p>
<p>Anyone could stop right there — keep buying, keep selling, and watch the profits grow. But I wanted to test myself. I wanted to see how far $100 could really go.</p>
<h3>Stage 1: Turning $100 Into $1,000</h3>
<p>The flipping side hustle gave me my first $1,000 — all from starting with next to nothing. It wasn’t glamorous, but it was proof that resourcefulness beats resources.</p>
<p>Once I had that $1,000, I decided to do what I’d built <strong>Business Gap Finder</strong> to help others do: find a real, local business opportunity with data, not guesswork.</p>
<h3>Stage 2: Finding the Next Step With the App</h3>
<p>I opened <strong>Business Gap Finder</strong>, entered Victoria, BC, a $1,000 budget, and told it I wanted a low-cost service business with high local demand.</p>
<p>The app ran the analysis and came back with something that instantly made sense: <strong>Bin Cleaning.</strong></p>
<p>It wasn’t a glamorous idea. But it was a <em>good</em> one — practical, recurring, scalable, and affordable to start. It reminded me of what I tell every new entrepreneur: “Leave your ego at the door — you’re here to build something that works.”</p>
<h3>Stage 3: Setting Up the Business</h3>
<p>I bought a power washer, some eco-friendly cleaner, and a few marketing supplies. Then I used the app’s <strong>Pricing & Breakeven Calculator</strong> to figure out my numbers. It showed me what competitors were charging, what I could undercut, and how to make profit per job.</p>
<p>So I offered a deal to my first customers: “Bring your neighbours in and get 5% off for each one.”</p>
<p>That small incentive did something brilliant — it cut travel time and filled my schedule. One street at a time, the work started to snowball.</p>
<h3>Stage 4: Scaling the Simple Way</h3>
<p>Within weeks, I was making <strong>$400 a day</strong> cleaning bins and driveways. But instead of pocketing it all, I reinvested: 30% into better equipment, 20% into local ads, 10% into materials, and the rest into savings for the next stage.</p>
<p>As the customer base grew, so did the opportunity. Soon, we added <strong>roof, gutter, and siding cleaning</strong> — all complementary services found through the app’s “Grow” toolkit. What started as $100 was now a thriving small enterprise.</p>
<h3>Stage 5: Building Toward Freedom</h3>
<p>At this stage, it wasn’t about cleaning bins anymore — it was about building a system. I began training others, documenting workflows, automating bookings, and investing in software that could run day-to-day operations.</p>
<p>The goal was clear: <em>Create a business that can run without me — so I can start the next one.</em></p>
<h3>Stage 6: What Comes Next</h3>
<p>The plan now is simple: get this first business self-running by the end of the year and use the profits to buy into or launch the next opportunity the app identifies. Each business funds the next — a chain of ventures built on real work, not theory.</p>
<h3>Final Thoughts</h3>
<p>You don’t need luck. You don’t need investors. You just need a willingness to start small, learn fast, and use the tools available to you.</p>
<p>If $100 can turn into a self-sustaining business, what could you do with the same focus?</p>
<div class="my-6 p-4 bg-amber-50 border-l-4 border-accent text-center">
    <p class="font-bold">👉 Try the free quiz at Business Gap Finder</p>
    <p>See where your first $100 might take you.</p>
</div>`,
    tags: ["startup challenge", "small business", "entrepreneurship", "Victoria BC", "bootstrapping", "AI business tools"],
    related: ["why-its-worth-taking-the-leap", "from-idea-to-income"],
    views: 0,
  },
   {
    id: 3,
    slug: 'brand-in-a-weekend',
    title: "Brand in a Weekend: Naming, Logo, and Voice Without Hiring an Agency",
    author: "Danny Hamilton",
    date: "2025-11-15",
    category: "Branding & Marketing",
    readTime: "6 min read",
    excerpt: "A step-by-step guide to creating a complete business brand in one weekend — name, logo, and voice — using Business Gap Finder’s AI-powered Brand Toolkit.",
    body: `<h2>Your brand isn’t just your logo. It’s the promise you make — and how people feel when they see it.</h2>
<p>When most new business owners hear the word <em>branding</em>, they picture a fancy agency, endless revisions, and invoices that could fund a small car. But in 2025, that model’s broken.</p>
<p>With the right approach (and the right tools), you can create a clean, confident brand in a single weekend — one that feels professional, unique, and completely yours.</p>
<p>Here’s how I built brands for my businesses in under 48 hours — and how you can do the same.</p>
<h3>Step 1: Start With What You Stand For</h3>
<p>Before colors or logos, you need clarity.</p>
<p>Ask yourself three questions:</p>
<ul>
<li>What problem do I solve?</li>
<li>Who am I solving it for?</li>
<li>How do I want them to feel when they work with me?</li>
</ul>
<p>For my latest service brand in Victoria, the goal was simple: reliability and trust. Everything — from the name to the tone — flowed from that foundation.</p>
<p><strong>Inside the Business Gap Finder toolkit:</strong> The <em>Brand Builder</em> asks you these exact questions and turns your answers into name ideas, taglines, and tone-of-voice guides that fit your business type.</p>
<h3>Step 2: Name It Right</h3>
<p>The best names are the ones that make people get it instantly. Forget trying to sound clever. Think clarity, memorability, and context.</p>
<p>Examples from my own ventures:</p>
<ul>
<li><strong>Axe & Grind</strong> — says exactly what it is.</li>
<li><strong>Emerald Works</strong> — sounds local, strong, and trusted.</li>
<li><strong>Writer’s Muse AI</strong> — evokes purpose and creativity.</li>
</ul>
<p><strong>My 3-point checklist:</strong> Easy to say, looks good on a sign or URL, and means something to your audience.</p>
<p>If you can say it out loud three times without cringing, it’s probably a keeper.</p>
<h3>Step 3: Build the Visuals</h3>
<p>Now it’s time for your brand’s face. Start with a mood board — gather 5–6 images that reflect your business vibe: color palette, textures, typography, tone. If your brand was a person, what would they wear? Modern? Earthy? Minimalist?</p>
<p>Test your ideas:</p>
<ul>
<li>Pick 2–3 fonts (headline and body)</li>
<li>Choose 3 colors (main, accent, background)</li>
<li>Make sure your logo looks good in black and white</li>
</ul>
<p><strong>Inside the Brand Toolkit:</strong> The <em>Logo & Style Generator</em> creates logo options, color palettes, and mockups tailored to your tone and industry — ready to download instantly.</p>
<h3>Step 4: Give Your Brand a Voice</h3>
<p>If your visuals are the face of your brand, your voice is the personality. It’s how you speak to your customers — in emails, ads, and on social media.</p>
<p>Start by writing down three adjectives that describe your tone. Mine were: reliable, friendly, professional.</p>
<p>Then test it with a few lines — your website intro, your Instagram bio, your email sign-off. Does it sound consistent? If yes, that’s your voice. If not, refine it until it does.</p>
<p><strong>Inside the toolkit:</strong> The <em>Brand Voice Assistant</em> helps define tone, personality traits, and even generates sample bios and taglines consistent with your identity.</p>
<h3>Step 5: Put It Into the World</h3>
<p>Once your brand is set, test it. Update your profiles, business cards, or flyers. Ask 5 people what your brand feels like — not what it looks like. If their answers match your intention, your branding works.</p>
<p>Move fast. Don’t overthink it. A brand is a living thing — it evolves as you do.</p>
<h3>Bonus: What I Learned Doing It Myself</h3>
<p>When I built my first few brands, I wasted weeks debating fonts and shades of blue. Now, I do it in a weekend. Branding isn’t about perfection — it’s about direction.</p>
<p>Each of my businesses — from <strong>Axe & Grind</strong> to <strong>Emerald Works</strong> — started with a weekend’s work and a clear identity. The details came later.</p>
<h3>Final Thought</h3>
<p>Your brand isn’t just how you look — it’s how you make people feel. You don’t need an agency to find that feeling.</p>
<div class="my-6 p-4 bg-amber-50 border-l-4 border-accent text-center">
    <p class="font-bold">👉 Build your brand this weekend with Business Gap Finder’s toolkit</p>
    <p>Create something that feels like you, not a committee.</p>
</div>`,
    tags: ["branding", "small business", "entrepreneurship", "DIY logo", "marketing", "brand voice"],
    related: ["from-idea-to-income", "the-100-startup-challenge"],
    views: 952,
  },
  {
    id: 2,
    slug: 'how-to-build-a-small-business-budget',
    title: 'How to Build a Small-Business Budget (Even If You Hate Numbers)',
    author: 'Danny Hamilton',
    date: '2025-11-10',
    category: 'Finance & Planning',
    readTime: '7 min read',
    excerpt: 'Learn to plan your startup finances the simple way. This step-by-step guide shows how to build a budget, forecast cashflow, and track profit using Business Gap Finder’s Finance Toolkit.',
    body: `<h2>Let’s be honest — most new entrepreneurs don’t start a business because they love spreadsheets.</h2>
<p>They start because they love the idea. But the truth is, the difference between a side hustle and a successful business is knowing your numbers — even just the basics.</p>
<p>The good news? Building a small-business budget doesn’t require an accounting degree. It just needs a plan, a calculator, and a little discipline.</p>
<h3>1️⃣ Start With What You Know — and What You Can Guess</h3>
<p>A budget isn’t a contract, it’s a map. If you don’t know your exact numbers yet, estimate. The key is to get something on paper so you can spot gaps before they sink you.</p>
<p>Begin with three questions:</p>
<ul>
<li>How much do I need to launch?</li>
<li>How much will it cost to run each month?</li>
<li>How much can I realistically make?</li>
</ul>
<p><strong>Inside Business Gap Finder:</strong> the <em>Pricing & Breakeven Calculator</em> auto-fills these answers from your quiz data, showing when you’ll start turning a profit.</p>
<h3>2️⃣ Break Your Costs Into Three Buckets</h3>
<p>Every business has the same types of expenses:</p>
<ul>
<li><strong>Startup Costs</strong> — one-time items like equipment or licenses.</li>
<li><strong>Fixed Costs</strong> — rent, insurance, software — the bills that don’t stop.</li>
<li><strong>Variable Costs</strong> — materials, shipping, ad spend — they rise and fall with sales.</li>
</ul>
<p>Add a 10–15% buffer. That “something always goes wrong” fund is what keeps businesses alive.</p>
<h3>3️⃣ Plan for Revenue — Not Just Sales</h3>
<p>Don’t confuse <em>sales</em> with <em>revenue</em>. Revenue is money received. Cashflow is when it arrives. If you bill today but get paid next month, you don’t have revenue yet — you have a promise.</p>
<p><strong>Inside the Finance Toolkit:</strong> the <em>Cashflow Template</em> shows you when money actually hits your account, not just when you send an invoice.</p>
<h3>4️⃣ Define Your “Enough to Survive” Number</h3>
<p>Every business has a burn rate — the amount it needs each month to stay alive. Ask yourself: <em>How long can I run before I need to make a sale?</em> That’s your runway.</p>
<p>Use this quick breakeven formula:</p>
<pre class="bg-gray-100 p-2 rounded text-sm">Fixed Costs ÷ (Price – Variable Cost per Sale) = # of Sales to Break Even</pre>
<p>If you need to sell 10,000 cupcakes a month to cover rent, it’s time to rethink pricing.</p>
<h3>5️⃣ Set Mini Targets Instead of Massive Goals</h3>
<p>A $100,000 goal sounds huge — until you break it down: $8,333 a month or $277 a day. Suddenly it’s doable. Mini targets create momentum and confidence.</p>
<p><strong>Inside Business Gap Finder:</strong> your <em>Financial Projections</em> tool converts daily sales targets into 1- and 3-year forecasts showing exactly when you’ll hit profit.</p>
<h3>6️⃣ Review Monthly, Adjust Quarterly</h3>
<p>A budget isn’t a tattoo — it changes as your business does. Schedule a monthly “money meeting” — even if it’s just you and a coffee. Review:</p>
<ul>
<li>Total revenue vs. goal</li>
<li>Top three expenses</li>
<li>One cost to cut next month</li>
</ul>
<p>Each review keeps you steering with eyes open, not fingers crossed.</p>
<h3>Final Thought</h3>
<p>Budgeting isn’t about cutting fun — it’s about giving your business oxygen to grow. You don’t have to love numbers; you just have to listen to what they’re telling you.</p>
<div class="my-6 p-4 bg-amber-50 border-l-4 border-accent text-center">
    <p class="font-bold">👉 Build your first budget today using the Finance Toolkit inside Business Gap Finder.</p>
</div>`,
    tags: ["finance", "cashflow", "budgeting", "entrepreneurship", "startup planning", "Business Gap Finder"],
    related: ["from-idea-to-income", "brand-in-a-weekend"],
    views: 876,
  },
  {
    id: 1,
    slug: 'from-idea-to-income',
    title: 'From Idea to Income: How to Test if Your Business Will Actually Work',
    author: 'The Business Gap Finder Team',
    date: '2025-03-15',
    category: 'Getting Started',
    readTime: '6 min read',
    excerpt: 'Most businesses don’t fail because they’re bad ideas — they fail because no one tested them first. Learn the six essential steps to validate your idea before you invest your time and money.',
    body: `<h2>You’ve got an idea — now what?</h2>
<p>Maybe it came to you in the shower, on your commute, or while complaining that someone else’s product could be better. Most people stop there. The real difference between dreamers and founders is this: founders test before they invest.</p>
<h3>1️⃣ Start with a Problem, Not a Product</h3>
<p>The best business ideas start with a problem. Ask yourself:</p>
<ul>
<li>Does this problem happen often enough for people to care?</li>
<li>Are people currently paying to solve it?</li>
<li>Is my solution genuinely easier, cheaper, or better?</li>
</ul>
<p>If you can’t answer yes to at least two, pause. It might be a great hobby, not a great business.</p>
<h3>2️⃣ Check the Demand</h3>
<p>Use Google Trends, Facebook Marketplace, and Reddit to see what people are already searching for or buying. If people are constantly asking for solutions, you’ve found a gap worth exploring.</p>
<h3>3️⃣ Talk to Real People</h3>
<p>Skip asking your friends — they’ll lie to protect your feelings. Talk to potential customers and ask what they use now, what frustrates them, and what they’d change. If their eyes light up, you’re onto something.</p>
<h3>4️⃣ Build a Tiny Test</h3>
<p>Before building a full business, build a reaction. Create a one-page site, post an offer, and track how many people click “Join Waitlist.” Real interest beats assumptions every time.</p>
<h3>5️⃣ Run the 3×3 Rule</h3>
<p>Every real business idea should have:
<ul>
<li>3 customers ready to pay,</li>
<li>3 competitors (proof of a market),</li>
<li>3 ways to reach them (ads, community, referrals).
</ul></p>
<h3>6️⃣ Build Your Simple Plan</h3>
<p>At this point, you’re ready for a quick one-page business plan: Who you’re selling to, what problem you solve, how you make money, and how much you’ll need to start.</p>
<h3>Bottom Line</h3>
<p>Most businesses don’t fail because they’re bad ideas — they fail because no one tested them first. Test before you build, and if people would pay tomorrow, you’re ready today.</p>`,
    tags: ['business ideas', 'validation', 'entrepreneurship', 'startup tips'],
    related: ['how-to-build-a-small-business-budget', 'brand-in-a-weekend'],
    views: 1204,
  },
];