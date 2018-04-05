Category.create(name: 'Electronics')
Category.create(name: 'Musical Instruments')
Category.create(name: 'Household Appliances')
Category.create(name: 'Books')
Category.create(name: 'Video Games')
Category.create(name: 'Toys & Games')
Category.create(name: 'Cell Phones')
Category.create(name: 'Sporting Equipment')

# Location.create(city: 'Portland', state: 'OR', slug:'portland-or')
# Location.create(city: 'New York', state: 'NY', slug:'new-york-ny')


user_ids = User.all.select(:id).map{|user| user.id}

listing_1 = Listing.create(
    title: "Gibson 2017 Les Paul Custom Special Electric Guitar Ebony Brown Shell Pickguard",
    description: "Body shape: Les Paul Body type: Solid Body Body material: Mahogany Top wood: Mahogany Body wood: Mahogany Body finish: Select finish Orientation: Right Hand Neck Neck shape: Slim Taper Neck wood: Maple Joint: Set Neck Scale length: 24.75 Truss rod: Single Action Neck finish: Select finish Fretboard Material: Rosewood Radius: Slim Taper Fret size: Medium Number of frets: 22 In
    Absolutely no compromise for the new S Series Made-in-USA guitars
    The Les Paul Custom Special was designed around Gibson's standards of quality and innovation for Gibson USA's new S Series, bringing unprecedented value in an American-made guitar
    It is made in USA, with American craftsmanship that is second to none, and featuring superior quality, tone and playability, and a modern design inspired by the Les Paul ""The Paul"" model
    The Les Paul Custom Special features a nitrocellulose finish, with Gibson's new nitro light gloss for the body and a nitro satin finish for the neck",
    price: "359.32",
    location_id: '1',
    category_id: '2',
    user_id: user_ids[rand(1..(user_ids.length - 1))]
)

listing_1.tags.find_or_create_by(name: "guitar")
listing_1.tags.find_or_create_by(name: "gibson")
listing_1.tags.find_or_create_by(name: "music")
listing_1.tags.find_or_create_by(name: "fender")
listing_1.tags.find_or_create_by(name: "electric guitar")
listing_1.tags.find_or_create_by(name: "cutaway guitar")
listing_1.tags.find_or_create_by(name: "custom made")
listing_1.tags.find_or_create_by(name: "black")
listing_1.tags.find_or_create_by(name: "pickups")

listing_1.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71-wg7LVAwL._SL1500_.jpg")
listing_1.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61dI6ynBIGL._SL1500_.jpg")
listing_1.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71yVvwNK35L._SL1500_.jpg")
listing_1.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71zTesqnEpL._SL1500_.jpg")
listing_1.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/5178R%2B%2BFiwL._SL1500_.jpg")


def addListing
    listing_2 = Listing.create(
        title: "Squier by Fender Stratocaster Pack with Frontman 10G Amp, Cable, Strap, Picks, and Online Lessons",
        description: 'A perfect choice for beginners, the new Squier Strat Pack has everything you need to begin playing right out of the box. The short-scale Stratocaster (24") is ideal for players with smaller hands and provides a comfortable playing feel. Other features include a lightweight body, a hardtail bridge for rock-solid tuning and three single-coil pickups for classic Strat tone. The included Squier Frontman 10G amplifier is the perfect companion for jamming thanks to its aux input that allows you play along with your favorite songs or backing tracks, as well as a headphone jack for silent practice. The Squier Starter Strat Pack also comes with a strap, cable and picks -- everything you need to stop dreaming and start playing.',
        price: "129.99",
        location_id: '1',
        category_id: '2',
        user_id: user_ids[rand(1..(user_ids.length - 1))])


    listing_2.tags.find_or_create_by(name: "guitar")
    listing_2.tags.find_or_create_by(name: "squier")
    listing_2.tags.find_or_create_by(name: "music")
    listing_2.tags.find_or_create_by(name: "fender")
    listing_2.tags.find_or_create_by(name: "electric guitar")
    listing_2.tags.find_or_create_by(name: "cutaway guitar")
    listing_2.tags.find_or_create_by(name: "custom made")
    listing_2.tags.find_or_create_by(name: "black")
    listing_2.tags.find_or_create_by(name: "pickups")

    listing_2.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71ELNDf7Y%2BL._SL1280_.jpg")
    listing_2.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61dI6ynBIGL._SL1500_.jpg")
    listing_2.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71yVvwNK35L._SL1500_.jpg")
    listing_2.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71zTesqnEpL._SL1500_.jpg")
    listing_2.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/5178R%2B%2BFiwL._SL1500_.jpg")

end

listing_3 = Listing.create(
    title: "Echo Dot (2nd Generation) - Black",
    description: '

    Echo Dot (2nd Generation) is a hands-free, voice-controlled device that uses Alexa to play music, control smart home devices, make calls, send and receive messages, provide information, read the news, set music alarms, read audiobooks from Audible, control Amazon Video on Fire TV, and more
    Connects to speakers or headphones through Bluetooth or 3.5 mm stereo cable to play music from Amazon Music, Spotify, Pandora, iHeartRadio, and TuneIn. Play music simultaneously across Echo devices and speakers connected via cable with multi-room music.
    Call or message almost anyone hands-free with your Echo device. Also, instantly connect to other Echo devices in your home using just your voice.
    Controls lights, fans, TVs, switches, thermostats, garage doors, sprinklers, locks, and more with compatible connected devices from WeMo, Philips Hue, Sony, Samsung SmartThings, Nest, and others
    Hears you from across the room with 7 far-field microphones for hands-free control, even in noisy environments or while playing music
    Includes a built-in speaker so it can work on its own as a smart alarm clock in the bedroom, an assistant in the kitchen, or anywhere you might want a voice-controlled computer; Amazon Echo is not required to use Echo Dot',
    price: "29.99",
    location_id: '1',
    category_id: '1',
    user_id: user_ids[rand(1..(user_ids.length - 1))])

listing_3.tags.find_or_create_by(name: "electronic")
listing_3.tags.find_or_create_by(name: "personal assistant")
listing_3.tags.find_or_create_by(name: "google home")
listing_3.tags.find_or_create_by(name: "alexa")

listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61qaMh0rSIL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61ikAJnULvL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61RrCPRq7mL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71zTesqnEpL._SL1500_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71-oquug6dL._SL1000_.jpg")



listing_4 = Listing.create(
    title: "Kenmore 50043 25 Cu. Ft. Side-by-Side Refrigerator with Water and Ice Dispenser, Stainless Steel, includes delivery and hookup",
    description: ' 25 cubic feet of interior space, adjustable easy-to-clean glass shelving. Gallon door bins and a humidity-controlled clear crisper bin give you tons of storage and organization options throughout the fridge
The in-door Dual Pad ice and water dispenser puts fresh water right in your glass, no button fumbling required. The ice dispenser has a clear built-in window so you can keep tabs on ice levels. A built-in water filter reduces water contaminants
Gallon-sized adjustable door bins, a dairy shelf, and tall item accommodation make grabbing commonly-used items quick and easy
This slim side-by-side refrigerator is lit up by bright LEDs so you can always find what you need, no need to dig through the fridge for the leftover pie ',
    price: "899.99",
    location_id: '2',
    category_id: '3',
    user_id: user_ids[rand(1..(user_ids.length - 1))]
)


listing_4.tags.find_or_create_by(name: "refrigerator")
listing_4.tags.find_or_create_by(name: "full size")
listing_4.tags.find_or_create_by(name: "freezer")
listing_4.tags.find_or_create_by(name: "kenmore")

listing_4.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/81OZxFsWf2L._SL1500_.jpg")
listing_4.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/81vzDrWYTkL._SL1500_.jpg")
listing_4.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61sJPfaRH8L._SL1200_.jpg")
listing_4.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61ReV7vlStL._SL1200_.jpg")

listing_5 = Listing.create(
    title: "Xbox One X 1TB Console",
    description: '
    Play on the world’s most powerful console. Experience 40% more power than any other console
    Games play better on Xbox One X. 6 teraflops of graphical processing power and a 4K Blu-ray player provides more immersive gaming and entertainment
    Play with the greatest community of gamers on the most advanced multiplayer network
    “The Xbox One X is a beast of a machine and worth every penny”- Xbox Achievement
    “…the smoothest, most immersive console gaming experience possible.” – Daily Star (UK)',
    price: "499.99",
    location_id: '2',
    category_id: '5',
    user_id: user_ids[rand(1..(user_ids.length - 1))]
)


listing_5.tags.find_or_create_by(name: "video games")
listing_5.tags.find_or_create_by(name: "microsoft")
listing_5.tags.find_or_create_by(name: "nintendo")
listing_5.tags.find_or_create_by(name: "minecraft")

listing_5.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61ux1cU49XL._AC_.jpg")
listing_5.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/51twrJq61UL._AC_.jpg")
listing_5.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/51C8VwVKcYL._AC_.jpg")
