package ke.zian.chatter;

import android.content.Intent;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ListView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class TimelineActivity extends AppCompatActivity {
    private ArrayList<Chatt> chattArrayList;
    private ChattAdapter chattAdapter;
    private SwipeRefreshLayout refreshContainer;
    final String url = "http://206.189.226.95/getchatts/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_timeline);
        chattArrayList = new ArrayList<Chatt>();
        chattAdapter = new ChattAdapter(this, chattArrayList);
        ListView lView = (ListView) findViewById(R.id.chattListView);
        lView.setAdapter(chattAdapter);

        refreshContainer = (SwipeRefreshLayout) findViewById(R.id.refreshContainer);
        refreshContainer.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshTimeline();
            }
        });
    }

    public void postChatt(View view) {
        Intent intent = new Intent(this, PostActivity.class);
        startActivity(intent);
    }

    private void refreshTimeline() {
        chattAdapter.clear();
        RequestQueue queue = Volley.newRequestQueue(this);
        queue.add(getRequest);
    }


    JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
        @Override
        public void onResponse(JSONObject response) {
            try {
                JSONArray array = response.getJSONArray("chatts");
                for (int i = 0; i < array.length(); i++) {
                    String username = array.getJSONArray(i).getString(0);
                    String message = array.getJSONArray(i).getString(1);
                    String timestamp = array.getJSONArray(i).getString(2);
                    chattAdapter.add(new Chatt(username, message, timestamp));
                }
            } catch (JSONException e) {
            }
            refreshContainer.setRefreshing(false);
        }
    },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    refreshContainer.setRefreshing(false);
                }
            }
    );


}
