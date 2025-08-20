from django.db import models

class Crop(models.Model):
    name = models.CharField(max_length=100)
    name_nepali = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='crops/', blank=True, null=True)
    
    def __str__(self):
        return self.name

class Market(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    contact = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return self.name

class Price(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    price_per_kg = models.DecimalField(max_digits=8, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    source = models.CharField(max_length=50, default='admin')
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.crop.name} - {self.market.name} - Rs.{self.price_per_kg}"

class UserSearch(models.Model):
    session_id = models.CharField(max_length=100, blank=True)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.crop.name} - {self.quantity}kg"
