from rest_framework import serializers
from .models import Crop, Market, Price, UserSearch

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = '__all__'

class PriceSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    crop_name_nepali = serializers.CharField(source='crop.name_nepali', read_only=True)
    market_name = serializers.CharField(source='market.name', read_only=True)
    
    class Meta:
        model = Price
        fields = ['id', 'crop', 'crop_name', 'crop_name_nepali', 'market', 'market_name', 
                 'price_per_kg', 'date', 'source']

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSearch
        fields = '__all__'
