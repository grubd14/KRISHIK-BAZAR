import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(project_dir))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'krisik_bazar.settings')

try:
    django.setup()
    print("Django setup successful!")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

try:
    from krisik_bazar.models import Crop, Market, Price
    print("Models imported successfully!")
except ImportError as e:
    print(f"Error importing models: {e}")
    print("Make sure you've run: python manage.py makemigrations && python manage.py migrate")
    sys.exit(1)

def create_sample_data():
    print("Starting to create sample data...")
    
    try:
        # Create crops
        crops_data = [
            {'name': 'Rice', 'name_nepali': 'चामल'},
            {'name': 'Wheat', 'name_nepali': 'गहुँ'},
            {'name': 'Corn', 'name_nepali': 'मकै'},
            {'name': 'Potato', 'name_nepali': 'आलु'},
            {'name': 'Tomato', 'name_nepali': 'गोलभेडा'},
        ]
        
        crops = []
        print("Creating crops...")
        for crop_data in crops_data:
            try:
                crop, created = Crop.objects.get_or_create(
                    name=crop_data['name'],
                    defaults=crop_data
                )
                crops.append(crop)
                if created:
                    print(f"✓ Created crop: {crop.name}")
                else:
                    print(f"→ Crop already exists: {crop.name}")
            except Exception as e:
                print(f"✗ Error creating crop {crop_data['name']}: {e}")
                continue
        
        if not crops:
            print("No crops were created. Exiting.")
            return
        
        # Create markets (no coordinates)
        markets_data = [
            {
                'name': 'Kalimati Market',
                'address': 'Kalimati, Kathmandu, Nepal',
                'contact': '01-4270654'
            },
            {
                'name': 'Baneshwor Market',
                'address': 'Baneshwor, Kathmandu, Nepal',
                'contact': '01-4470654'
            },
            {
                'name': 'Pulchowk Market',
                'address': 'Pulchowk, Lalitpur, Nepal',
                'contact': '01-5520654'
            },
            {
                'name': 'Bharatpur Market',
                'address': 'Bharatpur, Chitwan, Nepal',
                'contact': '056-521234'
            },
            {
                'name': 'Pokhara Market',
                'address': 'Pokhara, Kaski, Nepal',
                'contact': '061-521234'
            }
        ]
        
        markets = []
        print("\nCreating markets...")
        for market_data in markets_data:
            try:
                market, created = Market.objects.get_or_create(
                    name=market_data['name'],
                    defaults=market_data
                )
                markets.append(market)
                if created:
                    print(f"✓ Created market: {market.name}")
                else:
                    print(f"→ Market already exists: {market.name}")
            except Exception as e:
                print(f"✗ Error creating market {market_data['name']}: {e}")
                continue
        
        if not markets:
            print("No markets were created. Exiting.")
            return
        
        # Create sample prices
        import random
        from decimal import Decimal
        
        price_ranges = {
            'Rice': (80, 120),
            'Wheat': (60, 90),
            'Corn': (40, 70),
            'Potato': (30, 50),
            'Tomato': (50, 80)
        }
        
        print("\nCreating prices...")
        prices_created = 0
        for crop in crops:
            for market in markets:
                try:
                    min_price, max_price = price_ranges[crop.name]
                    price_per_kg = Decimal(str(random.randint(min_price, max_price)))
                    
                    price, created = Price.objects.get_or_create(
                        crop=crop,
                        market=market,
                        defaults={'price_per_kg': price_per_kg}
                    )
                    if created:
                        print(f"✓ Created price: {crop.name} at {market.name} - Rs.{price_per_kg}/kg")
                        prices_created += 1
                    else:
                        print(f"→ Price already exists: {crop.name} at {market.name}")
                except Exception as e:
                    print(f"✗ Error creating price for {crop.name} at {market.name}: {e}")
                    continue
        
        print(f"\n=== SUMMARY ===")
        print(f"Crops: {len(crops)}")
        print(f"Markets: {len(markets)}")
        print(f"Prices created: {prices_created}")
        print("Sample data creation completed!")
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()

def check_database():
    """Check if database tables exist"""
    try:
        # Try to query each model
        crop_count = Crop.objects.count()
        market_count = Market.objects.count()
        price_count = Price.objects.count()
        
        print(f"Database check successful:")
        print(f"- Crops table: {crop_count} records")
        print(f"- Markets table: {market_count} records") 
        print(f"- Prices table: {price_count} records")
        return True
        
    except Exception as e:
        print(f"Database check failed: {e}")
        print("This usually means the database tables haven't been created yet.")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("MeroBajar Data Population Script")
    print("=" * 50)
    
    # First check if database is ready
    if not check_database():
        print("\nTo fix this, run these commands:")
        print("1. python manage.py makemigrations")
        print("2. python manage.py migrate")
        print("3. Then run this script again: python populate_data.py")
        sys.exit(1)
    
    print("\nDatabase is ready. Proceeding with data population...")
    create_sample_data()
