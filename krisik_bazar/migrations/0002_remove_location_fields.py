from django.db import migrations


class Migration(migrations.Migration):

	dependencies = [
		('krisik_bazar', '0001_initial'),
	]

	operations = [
		migrations.RemoveField(
			model_name='market',
			name='latitude',
		),
		migrations.RemoveField(
			model_name='market',
			name='longitude',
		),
		migrations.RemoveField(
			model_name='usersearch',
			name='latitude',
		),
		migrations.RemoveField(
			model_name='usersearch',
			name='longitude',
		),
	]


