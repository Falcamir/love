// ======================================================
// OUR STORY V4
// Story Data
// ======================================================

const YOU = CONFIG.names.your;
const HER = CONFIG.names.her;

const STORY = [

    // =====================================
    // PROLOGUE
    // =====================================

    {
        id: "prologue",

        type: "chapter",

        icon: "💛",

        title: "Our Story",

        subtitle: "A Little Book",

        quote: "A collection of little moments that somehow became my favorite memories."
    },

    // =====================================
    // CHAPTER ONE
    // =====================================

    {
        id: "chapter1",

        type: "chapter",

        icon: "📸",

        title: "Chapter One",

        subtitle: "Our Memories",

        quote: "The little things always end up meaning the most."
    },

    {
        id: "memory1",

        type: "memory",

        image: "assets/images/memory1.jpg",

        caption: "Too Cute",

        text: "I still don't understand how you manage to be this cute without even trying. Every time I see this picture I just sit there smiling like an idiot",

        note: ""
    },

    {
        id: "memory2",

        type: "memory",

        image: "assets/images/memory2.jpg",

        caption: "Coolest Girl Ever",

        text: "How did my bibi make standing in an elevator look this cool?? Like hello?? You somehow looked gorgeous doing absolutely nothing. Not fair.",

        note: ""
    },

    {
        id: "memory3",

        type: "memory",

        image: "assets/images/memory3.jpg",

        caption: "Baby Mode",

        text: "These pajamas activated every protective instinct I have. You looked so tiny and adorable that I genuinely couldn't stop smiling.",

        note: ""
    },

    {
        id: "memory4",

        type: "memory",

        image: "assets/images/memory4.jpg",

        caption: "My Favorite Artist",

        text: "You actually sat down and drew me. That's one of those little things I'll probably remember forever because it made me super happy.",

        note: ""
    },

    {
        id: "memory5",

        type: "memory",

        image: "assets/images/memory5.jpg",

        caption: "Bedhead Queen",

        text: "Most people would've deleted a picture with messy hair... meanwhile I saved it because somehow you got even cuter.",

        note: ""
    },

    {
        id: "memory6",

        type: "memory",

        image: "assets/images/memory6.jpg",

        caption: "Pochita Approved",

        text: "Pochita, dramatic red lighting, and your little gremlin energy all in one picture. I absolutely love it. Hehehe",

        note: ""
    },

    {
        id: "futureMemory",

        type: "blank",

        title: "Reserved For Future Memories 📸",

        text: "This page is still empty... but not for long. We'll fill it with more adventures, more laughs, and way too many pictures together. 💛"
    },

    // =====================================
    // LETTER
    // =====================================

    {
        id: "letterChapter",

        type: "chapter",

        icon: "💌",

        title: "Chapter Two",

        subtitle: "A Letter",

        quote: "Somethings are easier to write than to say."
    },

    {
        id: "letter",

        type: "letter",

        title: `Dear ${HER}`,

        text: `I don't know if I tell you this enough, but I really, really like you.

You've become such an important person in my life, and every time we talk my day gets a little better. You make me smile without even trying, and I catch myself thinking about you all the time. Honestly, I don't even mind it because you're someone I always want on my mind.

Being so far away isn't easy. There are so many moments where I wish I could just be beside you instead of looking at you through a screen. I want to hear your laugh in person, hold your hand, hug you whenever I want, and just enjoy being close to you. Sometimes I miss moments we've never even had because I know how special they'll be once we're finally together.

Even with all the distance between us, my feelings haven't changed. If anything, they've only grown stronger. You mean so much to me, and I want to be there through everything. I want to celebrate your happy moments, cheer you on when you're working hard, and remind you how amazing you are whenever you forget.

I spend way too much time imagining all the things we'll get to do together someday. Cute dates, movie nights while cuddling, late-night drives with music playing, holding your hand wherever we go, watching sunsets, trying new food, taking way too many pictures together, playing games, and staying up talking until we accidentally fall asleep.

The little moments are the ones I look forward to the most. Going for walks, cooking together even if we make a mess, dancing around the kitchen for absolutely no reason, teasing each other over the dumbest things, or just sitting together in comfortable silence. Even doing nothing sounds perfect if I'm doing it with you.

I think about the day we finally meet more than you probably realize. I imagine seeing you for the first time, running straight to you, giving you the biggest hug I can, holding your hand, looking into your eyes, and finally getting to tell you everything I've wanted to say without a phone between us.

Whenever I think about my future, you're always in it. I know life can be unpredictable and we still have so much ahead of us, but if everything goes the way I hope it does, I'd love for you to be the person I spend the rest of my life with.

I don't just dream about meeting you. I dream about building a life together. Closing the distance forever, waking up beside you every morning, making breakfast together, laughing over the smallest things, supporting each other through every challenge, celebrating every achievement, and growing together through every stage of life.

I picture us having a place we can call home. Somewhere full of love, laughter, comfort, and peace. Somewhere that always feels warm because we're together.

Maybe one day, if it's something we both want, I'd love for you to become my wife. Just imagining standing beside you and promising to love you for the rest of my life makes me smile more than I can explain.

If it's something we both want, I'd also love to have a family with you one day. I know that's still far away, but whenever I imagine my future, you're always there.

I'm not trying to rush anything. I just wanted you to know how seriously I see you and how much you really mean to me.

Thank you for being yourself. Thank you for making me laugh, listening to me, caring about me, and giving me something so beautiful to look forward to every single day.

No matter how long this distance lasts, I truly believe you're worth every mile, every late-night call, every "I miss you," and every day we spend waiting. I believe one day we'll look back at all of this and smile because it was only the beginning of our story.

You mean more to me than I could ever properly explain. No matter how many words I write, they'll never fully show how much I care about you.

I can't wait for our first hug, our first date, our first adventure together, and hopefully one day, our forever.

Love,
${YOU} 💛`
    },

    // =====================================
    // FUTURE
    // =====================================

    {
        id: "future",

        type: "chapter",

        icon: "🌅",

        title: "Chapter Three",

        subtitle: "Dreams",

        quote: "The best memories are the ones we haven't made yet."
    },

    {
        id: "dreams",

        title: "Our Dreams",

        type: "dreams",

        dreams: [

            "✈️ Close the distance",

            "🎄 Spend Christmas together",

            "🌅 Watch sunsets side by side",

            "🍜 Go on lots of little dates",

            "🏡 Build a cozy home together",

            "📸 Fill another hundred photo albums",

            "💛 And much much moreeeeeee :3"

        ]
    },

    // =====================================
    // END
    // =====================================

    {
        id: "ending",

        type: "ending",

        title: "To Be Continued...",

        text: "This book reminds me how lucky I am to have you. And the best part is... our favorite memories haven't happened yet."
    },

    {
        id: "proposalIntro",

        hidden: true,

        type: "ending",

        title: "Wait...",

        text: "Before you close this book... there's something I'd really like you to read."
    },

    {
        id: "proposal",

        hidden: true,

        type: "chapter",

        icon: "💍",

        title: "Secret Chapter",

        subtitle: "Will You Be My Girlfriend?",

        quote: "I'd love to write this story with you. 💛"
    }

];