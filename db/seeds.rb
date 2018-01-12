location_ids = [2,3,5]
user_ids = User.all.select(:id).map{|user| user.id}

listing_1 = Listing.create(
    title: "Gibson 2017 Les Paul Custom Special Electric Guitar Ebony Brown Shell Pickguard",
    description: "Body shape: Les Paul Body type: Solid Body Body material: Mahogany Top wood: Mahogany Body wood: Mahogany Body finish: Select finish Orientation: Right Hand Neck Neck shape: Slim Taper Neck wood: Maple Joint: Set Neck Scale length: 24.75 Truss rod: Single Action Neck finish: Select finish Fretboard Material: Rosewood Radius: Slim Taper Fret size: Medium Number of frets: 22 In
    Absolutely no compromise for the new S Series Made-in-USA guitars
    The Les Paul Custom Special was designed around Gibson's standards of quality and innovation for Gibson USA's new S Series, bringing unprecedented value in an American-made guitar
    It is made in USA, with American craftsmanship that is second to none, and featuring superior quality, tone and playability, and a modern design inspired by the Les Paul ""The Paul"" model
    The Les Paul Custom Special features a nitrocellulose finish, with Gibson's new nitro light gloss for the body and a nitro satin finish for the neck",
    price: "359.32",
    location_id: '2',
    category_id: '26',
    user_id: user_ids[rand(0..4)]

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


listing_3 = Listing.create(
    title: "Echo Dot (2nd Generation) - Black",
    description: 'Echo Dot (2nd Generation) is a hands-free, voice-controlled device that uses Alexa to play music, control smart home devices, make calls, send and receive messages, provide information, read the news, set music alarms, read audiobooks from Audible, control Amazon Video on Fire TV, and more
    Connects to speakers or headphones through Bluetooth or 3.5 mm stereo cable to play music from Amazon Music, Spotify, Pandora, iHeartRadio, and TuneIn. Play music simultaneously across Echo devices and speakers connected via cable with multi-room music.
    Call or message almost anyone hands-free with your Echo device. Also, instantly connect to other Echo devices in your home using just your voice.
    Controls lights, fans, TVs, switches, thermostats, garage doors, sprinklers, locks, and more with compatible connected devices from WeMo, Philips Hue, Sony, Samsung SmartThings, Nest, and others
    Hears you from across the room with 7 far-field microphones for hands-free control, even in noisy environments or while playing music',
    price: "49.99",
    location_id: '2',
    category_id: '25',
    user_id: user_ids[rand(0..4)]

)


listing_3.tags.find_or_create_by(name: "guitar")
listing_3.tags.find_or_create_by(name: "squier")
listing_3.tags.find_or_create_by(name: "music")
listing_3.tags.find_or_create_by(name: "fender")
listing_3.tags.find_or_create_by(name: "electric guitar")
listing_3.tags.find_or_create_by(name: "cutaway guitar")
listing_3.tags.find_or_create_by(name: "custom made")
listing_3.tags.find_or_create_by(name: "black")
listing_3.tags.find_or_create_by(name: "pickups")

listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71ELNDf7Y%2BL._SL1280_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61dI6ynBIGL._SL1500_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71yVvwNK35L._SL1500_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71zTesqnEpL._SL1500_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/5178R%2B%2BFiwL._SL1500_.jpg")

listing_3 = Listing.create(
    title: "Echo Dot (2nd Generation) - Black",
    description: 'Echo Dot (2nd Generation) is a hands-free, voice-controlled device that uses Alexa to play music, control smart home devices, make calls, send and receive messages, provide information, read the news, set music alarms, read audiobooks from Audible, control Amazon Video on Fire TV, and more
    Connects to speakers or headphones through Bluetooth or 3.5 mm stereo cable to play music from Amazon Music, Spotify, Pandora, iHeartRadio, and TuneIn. Play music simultaneously across Echo devices and speakers connected via cable with multi-room music.
    Call or message almost anyone hands-free with your Echo device. Also, instantly connect to other Echo devices in your home using just your voice.
    Controls lights, fans, TVs, switches, thermostats, garage doors, sprinklers, locks, and more with compatible connected devices from WeMo, Philips Hue, Sony, Samsung SmartThings, Nest, and others
    Hears you from across the room with 7 far-field microphones for hands-free control, even in noisy environments or while playing music',
    price: "49.99",
    location_id: '2',
    category_id: rand(21..32),
    user_id: user_ids[rand(0..4)]
)


listing_3.tags.find_or_create_by(name: "electronic")
listing_3.tags.find_or_create_by(name: "personal assistant")
listing_3.tags.find_or_create_by(name: "google home")
listing_3.tags.find_or_create_by(name: "alexa")

listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61qaMh0rSIL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61ikAJnULvL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/61RrCPRq7mL._SL1000_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71zTesqnEpL._SL1500_.jpg")
listing_3.listing_images.create(image_url: "https://images-na.ssl-images-amazon.com/images/I/71-oquug6dL._SL1000_.jpg")

