"""
URL configuration for krisik_bazar project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'crops', views.CropViewSet)
router.register(r'markets', views.MarketViewSet)
router.register(r'prices', views.PriceViewSet)

urlpatterns = [
    # Frontend - Serve modularized template
    path('', TemplateView.as_view(template_name='app.html'), name='frontend'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/search-prices/', views.search_prices, name='search_prices'),
    path('api/crops/', views.get_crops, name='get_crops'),
    path('api/markets/', views.get_markets, name='get_markets'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
