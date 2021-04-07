from django import forms
from .models import MovieActor,Movie,Serial

class ActorImageForm(forms.ModelForm):
    class Meta:
        model = MovieActor
        fields = ['image']

class MoviePosterForm(forms.ModelForm):
    class Meta:
        model = Movie
        fields = ['poster']

class SerialPosterForm(forms.ModelForm):
    class Meta:
        model = Serial
        fields = ['poster']
