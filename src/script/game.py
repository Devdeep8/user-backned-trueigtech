import random
import csv

# 1. Define data pools to create variety
adjectives = ["Super", "Mega", "Cyber", "Tiny", "Iron", "Dark", "Light", "Neon", "Medieval", "Wild", "Cosmic", "Epic", "Silent", "Furious", "Golden", "Crystal"]
nouns = ["Racer", "Warrior", "Chef", "Builder", "Pilot", "Detective", "Hero", "Legend", "Empire", "City", "Farm", "Dungeon", "Ninja", "Pirate", "Robot", "Zombie"]
genres = ["Action", "RPG", "Racing", "Puzzle", "Sports", "Arcade", "Strategy", "Horror", "Simulation", "Adventure"]
actions = ["Build", "Destroy", "Explore", "Race", "Fight", "Solve", "Manage", "Survive", "Conquer", "Defend"]

def generate_name():
    """Generates a random game name like 'Cyber Warrior' or 'Epic Empire'."""
    return f"{random.choice(adjectives)} {random.choice(nouns)}"

def generate_description(name, genre):
    """Generates a semi-realistic description based on the name and genre."""
    noun = name.split()[-1] # Get the last word of the name (e.g., "Warrior")
    action = random.choice(actions)
    templates = [
        f"{action} your way to victory in this exciting {genre} game featuring the legendary {noun}.",
        f"Experience the thrill of {noun} in this top-rated {genre} adventure.",
        f"The ultimate {genre} experience awaits you in {name}.",
        f"Join millions of players in this {genre} classic focused on {action.lower()} and {noun.lower()}s.",
        f"A masterful {genre} journey where you must become the ultimate {noun}."
    ]
    return random.choice(templates)

# 2. Generate the data
rows = []
for i in range(1, 1001):
    name = generate_name()
    genre = random.choice(genres)
    description = generate_description(name, genre)
    
    # Format URLs based on index to ensure uniqueness
    safe_name = name.lower().replace(" ", "-")
    image_url = f"https://example.com/images/{safe_name}-{i}.jpg"
    game_url = f"https://example.com/games/{safe_name}-{i}"
    
    # Randomly active or not (approx 80% active)
    is_active = random.choice([True, True, True, True, False])

    rows.append({
        "name": name,
        "description": description,
        "genre": genre,
        "imageUrl": image_url,
        "gameUrl": game_url,
        "isActive": is_active
    })

# 3. Write to CSV
filename = 'games.csv'
with open(filename, mode='w', newline='', encoding='utf-8') as file:
    fieldnames = ['name', 'description', 'genre', 'imageUrl', 'gameUrl', 'isActive']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    writer.writeheader()
    writer.writerows(rows)

print(f"Successfully generated 1000 games in {filename}")