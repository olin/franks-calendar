from flask import Blueprint, render_template, request

public = Blueprint('public', __name__, template_folder='../templates', static_folder='../static/build/')

@public.route('/')
def public_index():
    return render_template('home.html')

@public.route('/<page>')
def public_page(page):
    try:
        rendered_page = render_template("%s.html" % page)
    except:
        rendered_page = render_template("404.html")

    return rendered_page
