
<!DOCTYPE html>
<html>
	<head>
		<title>Future Gadgets Lab</title>
		<meta charset='utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css' integrity='sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ' crossorigin='anonymous'>
		<link rel='stylesheet' href='main.css'>
		<link rel='icon' href='images/fgadget_pin.png'>
	</head>
	<body>
		<div id='startup'>
			<div id='startup_msg' class='h2 text-center'>
				Entering<br>
				Future Gadgets<br>
				Laboratory
			</div>
		</div>
		<div id='startup_progress'>
			<div id='startup_progress_bar'>
				
			</div>
		</div>
		<div id='top'>
			<h1 class='text-center display-3'>F.G. Laboratory</h1>
			<div id='panel-top' class='container-fluid text-center'>
				<div class='row'>
					<div class='col-md-12'>
						
						<!--
						<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
						  <div class="btn-group" role="group" aria-label="First group">
						    <button type="button" class="btn btn-secondary">TIC TAC TOE</button>
						  </div>!!!
						  <div class="btn-group mr-2" role="group" aria-label="Second group">
						    <button type="button" class="btn btn-secondary">5</button>
						    <button type="button" class="btn btn-secondary">6</button>
						    <button type="button" class="btn btn-secondary">7</button>
						  </div>
						</div>
						-->
					</div>
				</div>
			</div>
		</div>
		<div class='container-fluid'>
			<div class='row'>
				<div id='display' class='col-md-9'>
					<!-- load gif -->
					<div id='display-load'>
					</div>
				</div>
				<div class='col-md-3' id='options'>
					<!--
				  <div class="card">
				    <div class='card-header'>
				      <h5 class="mb-0">
				        <a data-toggle="collapse" data-parent="#options" href="#game0">
				          Tic Tac Toe
				        </a>
				      </h5>
				    </div>
				
				    <div id="game0" class="collapse">
				      <div class="card-block">
				        <div class="btn-group-vertical col">
						  <button type="button" class="btn btn-secondary">Load</button>
						  <button type="button" class="btn btn-secondary">Reset</button>
						  <button type="button" class="btn btn-secondary">VS. Ai</button>
						</div>
				      </div>
				    </div>
				  </div>
				  <div class="card">
				    <div class="card-header" role="tab" id="headingTwo">
				      <h5 class="mb-0">
				        <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
				          Collapsible Group Item #2
				        </a>
				      </h5>
				    </div>
				    <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
				      <div class="card-block">
				        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
				      </div>
				    </div>
				  </div>
				-->
				</div>
			</div>
		</div>
		<div id='bot' class='container-fluid'>
			<div class='row'>
				<div id='panel-bottom' class='col'>
					<div id='react_container0'></div>
				</div>
			</div>
		</div>
		
		<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
		<script src='js/three.min.js'></script>
		<script src='js/games.js'></script>
		
		<script src="https://unpkg.com/react@15/dist/react.js"></script>
        <script src="https://unpkg.com/react-dom@15/dist/react-dom.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser.js"></script>
		
		<script src='js/util.js'></script>
		<script src='js/main.js'></script>
		<script src='js/main_react.js' type='text/babel'></script>
	</body>
</html>