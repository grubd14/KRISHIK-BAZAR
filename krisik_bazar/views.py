from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Crop, Market, Price, UserSearch
from .serializers import CropSerializer, MarketSerializer, PriceSerializer, UserSearchSerializer
import math

class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer

class MarketViewSet(viewsets.ModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer

class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

@api_view(['POST'])
def search_prices(request):
    """Search prices for a crop near a location"""
    try:
        crop_id = request.data.get('crop_id')
        quantity = request.data.get('quantity', 1)
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')
        
        if not crop_id or not lat or not lng:
            return Response({'error': 'Missing required data'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        lat = float(lat)
        lng = float(lng)
        
        # Get prices for the crop
        prices = Price.objects.filter(crop_id=crop_id).select_related('market')
        
        # Calculate distances and add to results
        results = []
        for price in prices:
            distance = calculate_distance(
                lat, lng, 
                float(price.market.latitude), 
                float(price.market.longitude)
            )
            
            results.append({
                'id': price.id,
                'crop_name': price.crop.name,
                'market_name': price.market.name,
                'price_per_kg': float(price.price_per_kg),
                'total_price': float(price.price_per_kg * quantity),
                'distance_km': round(distance, 2),
                'market_address': price.market.address,
                'date': price.date
            })
        
        # Sort by price (lowest first) and distance
        results.sort(key=lambda x: (x['price_per_kg'], x['distance_km']))
        
        # Save search
        UserSearch.objects.create(
            session_id=request.data.get('session_id', ''),
            crop_id=crop_id,
            quantity=quantity,
            latitude=lat,
            longitude=lng
        )
        
        return Response({
            'results': results,
            'best_price': results[0] if results else None,
            'nearest_market': min(results, key=lambda x: x['distance_km']) if results else None
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_crops(request):
    """Get all available crops"""
    crops = Crop.objects.all()
    serializer = CropSerializer(crops, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_markets(request):
    """Get all markets"""
    markets = Market.objects.all()
    serializer = MarketSerializer(markets, many=True)
    return Response(serializer.data)
