from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def page1():
   return render_template('page1.html')
@app.route('/page2')
def page2():
   return render_template('page2.html')
if __name__ == '__main__':
   app.run(debug=True)